from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from backend.ai_service import ask_ai_stream

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/ask")
async def ask(request: ChatRequest):

    def generate():
        for chunk in ask_ai_stream(request.message):
            yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )