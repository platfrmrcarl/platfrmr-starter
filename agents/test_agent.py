from google.adk import agents
import os

# Ensure your GEMINI_API_KEY is set in your environment variables
class TestAgent(agents.LlmAgent):
    def __init__(self):
        super().__init__(
            name="TestAgent",
            instructions="""
            You are a minimalist test agent. 
            Your sole responsibility is to generate a unique, creative string 
            of text based on the user's request. 
            Keep it concise and flavored with a bit of cyber-punk wit.
            """,
            model="gemini-3.0-flash" 
        )

    def generate_string(self, user_input: str):
        # The 'run' method invokes the LLM with the provided context
        response = self.run(f"User Request: {user_input}")
        return response