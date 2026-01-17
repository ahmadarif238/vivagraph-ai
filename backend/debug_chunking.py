
from langchain_text_splitters import RecursiveCharacterTextSplitter

text = """Topic: REST APIs and HTTP

1. What is an API

An API (Application Programming Interface) is a set of rules that allows different software applications to communicate with each other. It defines how requests and responses should be structured so systems can interact without knowing internal implementation details.

2. What is a REST API

A REST API follows the principles of Representational State Transfer. It is an architectural style, not a protocol. REST APIs typically use HTTP for communication and exchange data in formats like JSON.

Key characteristics include statelessness, client server separation, cacheability, layered system design, and uniform interfaces.

3. HTTP Methods

REST APIs commonly use HTTP methods to define actions:

GET retrieves data from the server

POST sends new data to the server

PUT updates an entire resource

PATCH partially updates a resource

DELETE removes a resource

Each method has a specific semantic meaning and should be used correctly.

4. HTTP Status Codes

HTTP status codes indicate the result of an API request:

200 OK: request successful

201 Created: resource successfully created

400 Bad Request: client sent invalid data

401 Unauthorized: authentication required

403 Forbidden: access denied

404 Not Found: resource does not exist

500 Internal Server Error: server failure

5. Statelessness in REST

Statelessness means that each client request must contain all information needed for the server to process it. The server does not store session information between requests. This improves scalability and reliability.

6. Authentication vs Authorization

Authentication verifies who the user is, usually via credentials or tokens. Authorization determines what actions the authenticated user is allowed to perform.

In REST APIs, authentication is often handled using API keys, JWT tokens, or OAuth.

7. Common Mistakes in REST APIs

Using GET requests to modify data

Ignoring proper status codes

Designing unclear or inconsistent endpoints

Storing session state on the server"""

def check_chunks():
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    chunks = text_splitter.split_text(text)
    print(f"Total chunks: {len(chunks)}")
    for i, chunk in enumerate(chunks):
        print(f"--- Chunk {i+1} ---")
        print(f"Length: {len(chunk)}")
        print(chunk[:50] + "..." + chunk[-50:])
        print("----------------")

if __name__ == "__main__":
    check_chunks()
