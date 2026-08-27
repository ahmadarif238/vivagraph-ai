FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies (gcc for building some python packages)
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create a non-root user for Hugging Face Spaces security
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH \
    HF_HOME=/home/user/.cache/huggingface

# Ensure cache directory exists
RUN mkdir -p /home/user/.cache/huggingface

# Hugging Face expects 7860; Render/Railway/Fly inject $PORT instead.
EXPOSE 7860

# Shell form so $PORT is expanded at runtime, with 7860 as the default. This
# makes the same image deployable on Spaces and on any PORT-injecting host.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}
