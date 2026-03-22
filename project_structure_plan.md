Clean Architecture.
src/
├── domain/
│   ├── entities/
│   ├── interfaces/
│   └── use_cases/
├── infrastructure/
│   ├── adapters/
│   ├── persistence/
│   └── parser/
└── presentation/
    └── api/
	

api endpoints.
POST /v1/hardware/parse
GET /v1/models/suggestions
POST /v1/analyze/full

requirements.
langchain
