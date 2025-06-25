from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import youtube

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(youtube.router, prefix="/api/youtube")
