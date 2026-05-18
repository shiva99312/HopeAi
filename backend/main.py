from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.ai_service import ask_ai_stream

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    message: str

# Home route
@app.get("/")
async def home():
    return {"message": "Hope AI Backend Running 🚀"}

# Ask AI route
@app.post("/ask")
async def ask_ai(request: ChatRequest):
    try:
        response = ask_ai_stream(request.message)

        return {
            "response": response
        }

    except Exception as e:
        return {
            "error": str(e)
        }