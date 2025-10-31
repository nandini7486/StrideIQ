from prisma import Prisma
from prisma.models import Rule
from contextlib import asynccontextmanager
from fastapi import FastAPI
import os

prisma = Prisma()

async def connect_db():
    await prisma.connect()

async def disconnect_db():
    await prisma.disconnect()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()
