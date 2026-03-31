from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from test_agent import TestAgent
import uvicorn

app = FastAPI(title="ADK Agent Service")

# Instantiate the agent globally so it maintains state if needed
test_agent = TestAgent()

class GenerateRequest(BaseModel):
    prompt: str = "Give me a random test string"

@app.get("/")
async def root():
    return {"message": "Agent Server is Online", "agent": "TestAgent"}

@app.post("/generate")
async def generate(request: GenerateRequest):
    try:
        # Call the agent logic
        output = test_agent.generate_string(request.prompt)
        return {
            "status": "success",
            "agent": test_agent.name,
            "output": output
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=8000)