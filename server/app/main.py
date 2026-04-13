from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .routes import auth, dialogue, progress, levels
from .config import settings
import os

app = FastAPI(
    title="Ramayana: The Epic Journey API",
    description="Backend services for AI dialogues, story progression, and user data.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(dialogue.router, prefix="/api/v1/dialogue", tags=["AI Dialogue"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Game Progress"])
app.include_router(levels.router, prefix="/api/v1/levels", tags=["Level Config"])

# Mount static files (ensure path is correct relative to server root)
client_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../client"))
app.mount("/static", StaticFiles(directory=client_path), name="static")

@app.get("/")
async def serve_home():
    return FileResponse(os.path.join(client_path, "index.html"))

@app.get("/health")
async def health():
    return {"status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
