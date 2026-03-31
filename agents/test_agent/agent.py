from google.adk import Agent
import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# Define the root_agent variable for adk web auto-discovery
root_agent = Agent(
    name="test_agent",
    instruction="You are a Star Wars quote generator. When a user sends a message, generate and return a single random iconic quote from the Star Wars movies, including the name of the character who said it. Do not include extra conversational filler.",
    model=os.getenv("GEMINI_MODEL")
)
