from fastapi import APIRouter
from app.models import CourseSchema, Course

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/")
def create_course(course_data: CourseSchema):
    course = Course(title=course_data.title).save()
    return {"message": f"Course '{course.title}' created"}

@router.get("/{title}")
def get_course(title: str):
    course = Course.nodes.get_or_none(title=title)
    if course:
        return {"title": course.title}
    return {"error": "Course not found"}