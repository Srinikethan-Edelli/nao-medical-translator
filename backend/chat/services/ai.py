import os
import logging
from openai import OpenAI, OpenAIError

logger = logging.getLogger(__name__)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# ----------------------------------
# TRANSLATE TEXT (SAFE VERSION)
# ----------------------------------

def translate_text(text, target_lang):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional medical translator."
                },
                {
                    "role": "user",
                    "content": f"Translate this to {target_lang}: {text}"
                },
            ],
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"AI TRANSLATION ERROR: {e}")

        # ✅ fallback so frontend never crashes
        return f"[DEV MODE – translation unavailable] {text}"


# ----------------------------------
# SUMMARIZE CONVERSATION (SAFE)
# ----------------------------------

def summarize_conversation(messages):
    try:
        joined = "\n".join(messages)

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Summarize this doctor patient medical conversation."
                },
                {
                    "role": "user",
                    "content": joined
                },
            ],
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        logger.error(f"AI SUMMARY ERROR: {e}")

        return "⚠️ Unable to generate summary right now."
