from fastapi import APIRouter
from app.models import TopicSchema, SkillSchema, CareerSchema, Topic, Skill, Career

router = APIRouter(prefix="/entities", tags=["Entities (Topics, Skills, Careers)"])

@router.post("/topics")
def create_topic(topic_data: TopicSchema):
    topic = Topic(name=topic_data.name).save()
    return {"message": f"Topic '{topic.name}' created"}

@router.post("/skills")
def create_skill(skill_data: SkillSchema):
    skill = Skill(name=skill_data.name).save()
    return {"message": f"Skill '{skill.name}' created"}

@router.post("/careers")
def create_career(career_data: CareerSchema):
    career = Career(title=career_data.title).save()
    return {"message": f"Career '{career.title}' created"}

@router.get("/topics/{name}")
def get_topic(name: str):
    topic = Topic.nodes.get_or_none(name=name)
    return {"name": topic.name} if topic else {"error": "Topic not found"}

@router.get("/skills/{name}")
def get_skill(name: str):
    skill = Skill.nodes.get_or_none(name=name)
    return {"name": skill.name} if skill else {"error": "Skill not found"}

@router.get("/careers/{title}")
def get_career(title: str):
    career = Career.nodes.get_or_none(title=title)
    return {"title": career.title} if career else {"error": "Career not found"}