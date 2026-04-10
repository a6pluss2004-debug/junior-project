from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.v1.routes.risk import router as risk_router
from config import settings
import logging

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Task Risk Predictor microservice starting on port %s", settings.SERVICE_PORT)
    yield
    logging.info("Task Risk Predictor microservice shutting down.")

app = FastAPI(
    title="Task Risk Predictor",
    description="AI microservice for predicting task delay risk using Gemma 4.",
    version="1.0.0",
    docs_url="/docs",    # Set to None in production for security
    redoc_url=None,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.NEXT_JS_ORIGIN],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)

app.include_router(risk_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "service": "task-risk-predictor",
        "version": "1.0.0"
    }
