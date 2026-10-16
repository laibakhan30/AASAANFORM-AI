import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemma-4-26b-a4b-it",
    contents="Reply with exactly: AasaanForm AI Gemma connection successful!",
)

print(response.text)