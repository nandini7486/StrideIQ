from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from prisma.models import Rule as RuleModel
from src.database import lifespan
import uuid

app = FastAPI(
    title="Expense Rule Engine API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
# List of allowed origins (add your frontend URLs here)
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",  # Common React port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# Pydantic models
class RuleBase(BaseModel):
    name: str
    description: Optional[str] = None
    condition: str
    action: str
    is_active: bool = True

class RuleCreate(RuleBase):
    pass

class RuleResponse(RuleBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Rules endpoints
@app.get("/api/rules", response_model=List[RuleResponse])
async def get_rules():
    rules = await RuleModel.prisma().find_many()
    return rules

@app.post("/api/rules", response_model=RuleResponse)
async def create_rule(rule: RuleCreate):
    rule_data = rule.model_dump()
    rule_data["id"] = str(uuid.uuid4())
    created_rule = await RuleModel.prisma().create(data=rule_data)
    return created_rule

@app.get("/api/rules/{rule_id}", response_model=RuleResponse)
async def get_rule(rule_id: str):
    rule = await RuleModel.prisma().find_unique(where={"id": rule_id})
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return rule

@app.put("/api/rules/{rule_id}", response_model=RuleResponse)
async def update_rule(rule_id: str, rule: RuleBase):
    updated_rule = await RuleModel.prisma().update(
        where={"id": rule_id},
        data=rule.model_dump()
    )
    if not updated_rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return updated_rule

@app.delete("/api/rules/{rule_id}")
async def delete_rule(rule_id: str):
    try:
        await RuleModel.prisma().delete(where={"id": rule_id})
        return {"message": "Rule deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail="Rule not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
