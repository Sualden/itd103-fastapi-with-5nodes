from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- 1. Import this!
import app.database as database
from app.routers import students, course, graph, entities

app = FastAPI(title="Knowledge Graph API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows your React app on localhost:5173 to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(students.router)
app.include_router(course.router)
app.include_router(entities.router)
app.include_router(graph.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)