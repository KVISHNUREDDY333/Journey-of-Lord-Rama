import google.generativeai as genai
from ..config import settings
import os

class LLMService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    async def get_response(self, prompt: str, character: str = "Rama"):
        if not self.model:
            return f"[System: AI not configured. {character} remains silent, looking at you with wisdom.]"
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error communicating with AI: {str(e)}"

llm_service = LLMService()
