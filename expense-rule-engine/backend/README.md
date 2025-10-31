# Expense Rule Engine Backend

This is the FastAPI backend for the Expense Rule Engine application.

## Prerequisites

- Python 3.9+
- PostgreSQL
- Node.js (for Prisma)
- pip (Python package manager)

## Setup

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL**:
   - Create a new PostgreSQL database named `expense_rules`
   - Update the `.env` file with your database credentials

3. **Set up Prisma**:
   ```bash
   # Install Prisma CLI globally
   npm install -g prisma
   
   # Install Prisma Client for Python
   pip install prisma
   
   # Generate Prisma Client
   prisma generate
   
   # Apply database migrations
   prisma db push
   ```

4. **Run the application**:
   ```bash
   # Development
   uvicorn src.main:app --reload
   
   # Production
   uvicorn src.main:app --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once the server is running, you can access:
- API Docs: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/expense_rules
APP_ENV=development
SECRET_KEY=your-secret-key-here
```
