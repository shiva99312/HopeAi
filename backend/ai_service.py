import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

groq_client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

conversation_history = []

def ask_ai_stream(prompt):

    global conversation_history

    conversation_history.append({
        "role": "user",
        "content": prompt
    })

    conversation_history = conversation_history[-10:]

    messages = [
        {
            "role": "system",
            "content": """
You are HopeAI, a warm and supportive AI assistant.

Rules:
- Keep responses short and comforting.
- Usually reply in 2-5 sentences.
- Avoid overwhelming the user.
- Speak calmly and naturally.
- Do not give huge paragraphs.
- Break long answers into small readable parts.
- Be emotionally supportive without sounding robotic.
- If the user seems sad or stressed, respond gently and simply.
- Only give detailed explanations if the user asks for them.
"""
        }
    ] + conversation_history

    try:

        stream = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            top_p=0.9,
            max_tokens=250,
            stream=True
        )

        full_reply = ""

        for chunk in stream:

            content = chunk.choices[0].delta.content or ""

            if content:
                full_reply += content
                yield content

        conversation_history.append({
            "role": "assistant",
            "content": full_reply
        })

    except Exception as e:
        yield f"Error: {str(e)}"