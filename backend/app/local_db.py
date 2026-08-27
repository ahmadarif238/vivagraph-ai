"""A local, dependency-free stand-in for the Supabase PostgREST client.

Why this exists
---------------
The Supabase project backing this app was deleted, which broke every
`supabase.table(...)...execute()` call - and because `app/db.py` raised at
import time, the API would not even start. Rewriting the ~17 call sites was not
worth it, so this module reimplements the small slice of the Supabase
query-builder the app actually uses (`select / insert / update / eq / order /
limit / single / execute`) on top of a local SQLite file.

The result: with no Supabase configured the app still runs a complete viva
session end to end and persists it. Point SUPABASE_URL/SUPABASE_KEY at a live
project and `app/db.py` transparently switches back to the real client.

Tables are created on demand and columns are added as they are first seen, so
no schema needs to be declared up front.
"""

from __future__ import annotations

import json
import os
import sqlite3
import tempfile
import threading
from datetime import date, datetime
from typing import Any

_LOCK = threading.Lock()


def _default_path() -> str:
    local = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "viva_local.db")
    try:
        with open(local, "a"):
            pass
        return local
    except OSError:
        # Serverless hosts (Vercel/Lambda) only allow writes under /tmp.
        return os.path.join(tempfile.gettempdir(), "viva_local.db")


def _encode(value: Any) -> Any:
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, (dict, list)):
        return json.dumps(value)
    return value


def _decode(value: Any) -> Any:
    if isinstance(value, str) and value[:1] in "[{":
        try:
            return json.loads(value)
        except (ValueError, TypeError):
            return value
    return value


class _Response:
    """Mimics the object returned by `.execute()` on the Supabase client."""

    def __init__(self, data: list, count: int | None = None):
        self.data = data
        self.count = count if count is not None else len(data)

    def __repr__(self) -> str:  # pragma: no cover - debugging aid
        return f"<LocalResponse rows={len(self.data)}>"


class _Query:
    def __init__(self, db: "LocalSupabase", table: str):
        self._db = db
        self._table = table
        self._op = "select"
        self._columns = "*"
        self._payload = None
        self._filters: list = []
        self._order = None
        self._limit = None
        self._single = False

    # -- builder methods (each returns self so calls can be chained) --
    def select(self, columns: str = "*", *_, **__) -> "_Query":
        self._op, self._columns = "select", columns
        return self

    def insert(self, data: Any, *_, **__) -> "_Query":
        self._op, self._payload = "insert", data
        return self

    def upsert(self, data: Any, *_, **__) -> "_Query":
        self._op, self._payload = "insert", data
        return self

    def update(self, data: dict, *_, **__) -> "_Query":
        self._op, self._payload = "update", data
        return self

    def delete(self, *_, **__) -> "_Query":
        self._op = "delete"
        return self

    def eq(self, column: str, value: Any) -> "_Query":
        self._filters.append((column, value))
        return self

    def order(self, column: str, desc: bool = False, **__) -> "_Query":
        self._order = (column, desc)
        return self

    def limit(self, count: int, **__) -> "_Query":
        self._limit = count
        return self

    def single(self) -> "_Query":
        self._single, self._limit = True, 1
        return self

    maybe_single = single

    # -- execution --
    def execute(self) -> _Response:
        with _LOCK:
            conn = self._db.connect()
            try:
                rows = self._run(conn)
                conn.commit()
            finally:
                conn.close()
        if self._single:
            return _Response(rows[:1])
        return _Response(rows)

    # -- internals --
    def _where(self):
        if not self._filters:
            return "", []
        clause = " WHERE " + " AND ".join('"%s" = ?' % c for c, _ in self._filters)
        return clause, [_encode(v) for _, v in self._filters]

    def _run(self, conn: sqlite3.Connection) -> list:
        table = self._table

        if self._op == "insert":
            payload = self._payload if isinstance(self._payload, list) else [self._payload]
            out = []
            for row in payload:
                self._db.ensure(conn, table, row)
                cols = list(row.keys())
                names = ", ".join('"%s"' % c for c in cols)
                placeholders = ", ".join("?" for _ in cols)
                cur = conn.execute(
                    'INSERT INTO "%s" (%s) VALUES (%s)' % (table, names, placeholders),
                    [_encode(row[c]) for c in cols],
                )
                inserted = dict(row)
                inserted.setdefault("id", cur.lastrowid)
                out.append(inserted)
            return out

        if self._op == "update":
            self._db.ensure(conn, table, self._payload)
            assignments = ", ".join('"%s" = ?' % c for c in self._payload)
            where, params = self._where()
            conn.execute(
                'UPDATE "%s" SET %s%s' % (table, assignments, where),
                [_encode(v) for v in self._payload.values()] + params,
            )
            return [dict(self._payload)]

        if not self._db.exists(conn, table):
            return []

        if self._op == "delete":
            where, params = self._where()
            conn.execute('DELETE FROM "%s"%s' % (table, where), params)
            return []

        # select
        where, params = self._where()
        sql = 'SELECT * FROM "%s"%s' % (table, where)
        if self._order:
            column, desc = self._order
            if self._db.has_column(conn, table, column):
                sql += ' ORDER BY "%s" %s' % (column, "DESC" if desc else "ASC")
        if self._limit:
            sql += " LIMIT %d" % int(self._limit)

        conn.row_factory = sqlite3.Row
        try:
            raw = conn.execute(sql, params).fetchall()
        except sqlite3.OperationalError:
            # A filter referenced a column this table has never seen.
            return []
        rows = [{k: _decode(v) for k, v in dict(r).items()} for r in raw]

        if self._columns and self._columns != "*":
            wanted = [c.strip() for c in self._columns.split(",") if c.strip()]
            rows = [{k: r.get(k) for k in wanted} for r in rows]
        return rows


class LocalSupabase:
    """Drop-in replacement exposing `.table(name)` like the Supabase client."""

    def __init__(self, path: str | None = None):
        self.path = path or _default_path()

    def connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.path, timeout=15)

    def table(self, name: str) -> _Query:
        return _Query(self, name)

    from_ = table

    def exists(self, conn: sqlite3.Connection, table: str) -> bool:
        cur = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)
        )
        return cur.fetchone() is not None

    def has_column(self, conn: sqlite3.Connection, table: str, column: str) -> bool:
        if not self.exists(conn, table):
            return False
        return column in {r[1] for r in conn.execute('PRAGMA table_info("%s")' % table)}

    def ensure(self, conn: sqlite3.Connection, table: str, row) -> None:
        """Create the table and any missing columns implied by `row`."""
        if not self.exists(conn, table):
            # Some tables are given an explicit id by the caller (sessions uses a
            # UUID string); others expect the database to assign one. An INTEGER
            # primary key rejects a UUID with "datatype mismatch", so only use
            # autoincrement when the caller is not supplying an id itself.
            if row and "id" in row:
                ddl = 'CREATE TABLE IF NOT EXISTS "%s" ("id" PRIMARY KEY)' % table
            else:
                ddl = ('CREATE TABLE IF NOT EXISTS "%s" '
                       '(id INTEGER PRIMARY KEY AUTOINCREMENT)' % table)
            conn.execute(ddl)
        if not row:
            return
        have = {r[1] for r in conn.execute('PRAGMA table_info("%s")' % table)}
        for column in row:
            if column not in have:
                conn.execute('ALTER TABLE "%s" ADD COLUMN "%s"' % (table, column))
