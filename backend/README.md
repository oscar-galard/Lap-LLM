# LAP-LLM Backend

Backend service for LLM optimization recommendations based on hardware specifications.

## Features

- Hardware specification analysis
- Model recommendations based on available resources
- RAG system with pgvector for PDF processing

## Setup

### Prerequisites

1. Python 3.13+
2. PostgreSQL with pgvector extension
3. Docker (optional, for easy setup)

### Installation

1. Install dependencies:
```bash
pip install -e .
```

2. Set up environment variables in `.env`:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/lap_llm
PDF_PATH=/path/to/your/research.pdf
```

3. Set up PostgreSQL with pgvector:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Running the Application

```bash
uvicorn main:app --reload
```

## API Endpoints

- `POST /hardware-specs/` - Register hardware specifications and get recommendations
- `GET /models/` - Get recommended models for current hardware

## RAG System with pgvector

This system uses a RAG (Retrieval-Augmented Generation) approach with pgvector for processing PDF research documents:

1. PDF content is loaded and split into chunks
2. Each chunk is embedded using OpenAI embeddings
3. Embeddings are stored in PostgreSQL with pgvector extension
4. When generating recommendations, relevant chunks are retrieved based on hardware specifications
5. These chunks are then used as context for generating recommendations

### Database Setup

To set up PostgreSQL with pgvector:

1. Install PostgreSQL
2. Install pgvector extension:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PDF_PATH`: Path to the research PDF file