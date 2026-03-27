# --- Stage 1: Builder ---
FROM python:3.13-slim AS builder

WORKDIR /app

# Install tools needed to compile LangChain dependencies (like tiktoken)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install uv

COPY pyproject.toml uv.lock ./
# This creates the .venv with all your LangChain libraries
RUN uv sync --no-dev --frozen

# --- Stage 2: Runtime ---
FROM python:3.13-slim

WORKDIR /app

# Only runtime lib for Postgres (if you use it)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy only the prepared environment and your code
COPY --from=builder /app/.venv /app/.venv
COPY . .

# Point Python to the virtual env
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["python", "main.py"]