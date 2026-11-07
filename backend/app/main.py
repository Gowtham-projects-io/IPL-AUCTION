import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.services.seed_service import seed_database
from backend.app.routers import (
    auth, seasons, teams, players, rooms, auction, admin, exports
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed default data
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(seasons.router, prefix=settings.API_PREFIX)
app.include_router(teams.router, prefix=settings.API_PREFIX)
app.include_router(players.router, prefix=settings.API_PREFIX)
app.include_router(rooms.router, prefix=settings.API_PREFIX)
app.include_router(auction.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)
app.include_router(exports.router, prefix=settings.API_PREFIX)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "season": "IPL 2027", "franchises": 10}

# Mount frontend production build if available
frontend_dist = os.path.abspath("frontend/dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path == "api":
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "app": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "theme": "Glacier Mint",
            "season": "IPL 2027",
            "docs_url": "/docs",
            "status": "online"
        }
