from fastapi import APIRouter
from app.models import StudentSchema, Student

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/")
def create_student(student_data: StudentSchema):
    student = Student(name=student_data.name).save()
    return {"message": f"Student '{student.name}' created"}

@router.get("/{name}")
def get_student(name: str):
    student = Student.nodes.get_or_none(name=name)
    if student:
        return {"name": student.name}
    return {"error": "Student not found"}