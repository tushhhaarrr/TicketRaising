
import os
import json
import google.generativeai as genai
from app.models.enums import TicketCategory, TicketPriority

async def classify_ticket_description(description: str):
    """
    Classifies a ticket description using Google Gemini to suggest category and priority.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    # Graceful fallback if API key is not set
    if not api_key:
        print("GEMINI_API_KEY not found. Returning default suggestions.")
        return {
            "suggested_category": TicketCategory.GENERAL.value,
            "suggested_priority": TicketPriority.MEDIUM.value
        }

    try:
        genai.configure(api_key=api_key)
        
        # Using gemini-1.5-flash as it is fast and efficient (often free tier eligible)
        model = genai.GenerativeModel('gemini-1.5-flash')

        prompt = f"""
        You are an expert IT support ticket classifier.
        Your task is to analyze the following ticket description and suggest the most appropriate Category and Priority.

        Available Categories:
        - billing (for payment, invoice, subscription issues)
        - technical (for software bugs, errors, crashes, feature malfunctions)
        - account (for login, password, profile, access issues)
        - general (for feedback, feature requests, or anything else)

        Available Priorities:
        - low (minor aesthetic issues, non-blocking questions)
        - medium (partial functionality loss, standard requests)
        - high (important functionality broken, urgent but not critical)
        - critical (system down, data loss, security breach, blocking entire workflow)

        Ticket Description:
        "{description}"

        Respond with valid JSON only. Do not include markdown formatting.
        Format: {{ "suggested_category": "...", "suggested_priority": "..." }}
        """

        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Clean potential markdown (Gemini sometimes adds ```json ... ```)
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
            
        if content.endswith("```"):
            content = content[:-3]
        
        result = json.loads(content)
        
        # Validate against known values (fallback if LLM hallucinates)
        category = result.get("suggested_category", TicketCategory.GENERAL.value)
        priority = result.get("suggested_priority", TicketPriority.MEDIUM.value)

        # Ensure valid enum values
        if category not in [e.value for e in TicketCategory]:
            category = TicketCategory.GENERAL.value
        if priority not in [e.value for e in TicketPriority]:
            priority = TicketPriority.MEDIUM.value

        return {
            "suggested_category": category,
            "suggested_priority": priority
        }

    except Exception as e:
        print(f"LLM Classification Error (Gemini): {e}")
        # Graceful fallback on error
        return {
            "suggested_category": TicketCategory.GENERAL.value,
            "suggested_priority": TicketPriority.MEDIUM.value
        }
