# GetButlr Backend (FastAPI)

## Setup

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run Server

```bash
uvicorn app.main:app --reload
```

## API Endpoint

POST `/api/youtube/analyze`

Sample Payload:
```json
{
  "topic": "Fishing for beginners"
}
```
