from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

# load environment variable fron .env
load_dotenv()

# initialize fastapi
app = FastAPI(title="EKN AI API - Powered by Gemini")

# expected request payload
class ChatRequest(BaseModel):
    message: str

# system prompt to govern AI behavior
SYSTEM_PROMPT = """
You are a helpful IT and HR assistant for our enterprise. 
Be concise, professional, and helpful. 
If you do not know the answer, state that you do not know and suggest opening a ticket.
"""

# new client automatically looks for the GEMINI_API_KEY 
client = genai.Client()

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # start a chat session 
        chat = client.chats.create(
            model="gemini-2.5-flash", 
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.3, 
            )
        )
        
        # send the user message
        response = chat.send_message(request.message)
        
        #  AI reply
        return {"reply": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# check endpoint
@app.get("/")
async def root():
    return {"status": "EKN Backend with the new Gemini SDK is running!"}