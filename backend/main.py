from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
import logging
from controllers.auth_controller import router as auth_router
from controllers.tournament_controller import router as tournament_router
from controllers.team_controller import router as team_router
from controllers.player_controller import router as player_router
from controllers.bracket_controller import router as bracket_router
from controllers.match_controller import router as match_router
from controllers.result_controller import router as result_router
from database import create_all_tables

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_all_tables()
    yield

app = FastAPI(
    title="TournaSphere API",
    description="College Tournament Management System API",
    version="1.0.0",
    lifespan=lifespan
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming Request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "msg": str(exc)}
    )

# CORS configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(tournament_router, prefix="/api/tournaments", tags=["Tournaments"])
app.include_router(team_router, prefix="/api/teams", tags=["Teams"])
app.include_router(player_router, prefix="/api/players", tags=["Players"])
app.include_router(bracket_router, prefix="/api/brackets", tags=["Brackets"])
app.include_router(match_router, prefix="/api/matches", tags=["Matches"])
app.include_router(result_router, prefix="/api", tags=["Results & Leaderboards"])

@app.get("/")
async def root():
    return {"message": "Welcome to TournaSphere API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
