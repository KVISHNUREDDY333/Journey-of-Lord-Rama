from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..ai.llm_service import llm_service
from ..config import settings
import os

router = APIRouter()

class DialogueRequest(BaseModel):
    character: str
    message: str
    current_state: str = "Intro"
    history: list = []

@router.post("/chat")
async def chat(request: DialogueRequest):
    # Load prompt template
    prompt_path = f"../ai/prompts/{request.character.lower()}_dialogue.txt"
    if not os.path.exists(prompt_path):
        prompt_template = f"You are {request.character} from the Ramayana."
    else:
        with open(prompt_path, "r") as f:
            prompt_template = f.read()
    
    # Construct full prompt
    full_prompt = prompt_template.format(
        current_state=request.current_state,
        player_memory="None",
        recent_dialogue=f"Player: {request.message}"
    )
    
    response = await llm_service.get_response(full_prompt, character=request.character)
    return {"character": request.character, "response": response}
