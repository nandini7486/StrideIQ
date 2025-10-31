from fastapi.testclient import TestClient
from src.main import app
import pytest

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "version": "1.0.0"}

def test_get_rules_empty():
    response = client.get("/api/rules")
    assert response.status_code == 200
    assert response.json() == []

class TestRulesAPI:
    def test_create_rule(self):
        rule_data = {
            "name": "Test Rule",
            "condition": "amount > 100",
            "actions": ["flag", "require_approval"],
            "is_active": True
        }
        response = client.post("/api/rules", json=rule_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Rule"
        assert data["is_active"] is True
        return data["id"]
    
    def test_get_rule(self):
        # First create a rule
        rule_data = {
            "name": "Test Get Rule",
            "condition": "amount > 100",
            "actions": ["flag"],
            "is_active": True
        }
        create_response = client.post("/api/rules", json=rule_data)
        rule_id = create_response.json()["id"]
        
        # Then get it
        response = client.get(f"/api/rules/{rule_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Get Rule"
        assert data["is_active"] is True

    def test_update_rule(self):
        # Create a rule first
        rule_data = {
            "name": "Test Update Rule",
            "condition": "amount > 100",
            "actions": ["flag"],
            "is_active": True
        }
        create_response = client.post("/api/rules", json=rule_data)
        rule_id = create_response.json()["id"]
        
        # Update the rule
        update_data = {"name": "Updated Rule Name", "is_active": False}
        response = client.put(f"/api/rules/{rule_id}", json=update_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Rule Name"
        assert data["is_active"] is False

    def test_delete_rule(self):
        # Create a rule first
        rule_data = {
            "name": "Test Delete Rule",
            "condition": "amount > 100",
            "actions": ["flag"],
            "is_active": True
        }
        create_response = client.post("/api/rules", json=rule_data)
        rule_id = create_response.json()["id"]
        
        # Delete the rule
        response = client.delete(f"/api/rules/{rule_id}")
        assert response.status_code == 200
        
        # Verify it's deleted
        get_response = client.get(f"/api/rules/{rule_id}")
        assert get_response.status_code == 404
