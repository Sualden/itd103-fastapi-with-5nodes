from fastapi import APIRouter
from app.models import RelationshipSchema, Student, Course, Topic, Skill, Career

router = APIRouter(prefix="/graph", tags=["Graph Connections"])

# ==========================================
# STUDENT RELATIONSHIPS
# ==========================================

@router.post("/student-enrolls-course")
def student_enrolls(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    course = Course.nodes.get_or_none(title=rel.target_name)
    if not student or not course: return {"error": "Nodes not found"}
    
    student.courses.connect(course)
    return {"message": f"Student '{student.name}' enrolled in '{course.title}'"}

@router.post("/student-interested-in-topic")
def student_interested_in_topic(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    topic = Topic.nodes.get_or_none(name=rel.target_name)
    if not student or not topic: return {"error": "Nodes not found"}
    
    student.interests_in_topics.connect(topic)
    return {"message": f"Student '{student.name}' is interested in topic '{topic.name}'"}

@router.post("/student-has-topic")
def student_has_topic(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    topic = Topic.nodes.get_or_none(name=rel.target_name)
    if not student or not topic: return {"error": "Nodes not found"}
    
    student.topics.connect(topic)
    return {"message": f"Student '{student.name}' has topic '{topic.name}'"}

@router.post("/student-has-skill")
def student_has_skill(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    skill = Skill.nodes.get_or_none(name=rel.target_name)
    if not student or not skill: return {"error": "Nodes not found"}
    
    student.skills.connect(skill)
    return {"message": f"Student '{student.name}' has skill '{skill.name}'"}

@router.post("/student-acquired-skill")
def student_acquired_skill(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    skill = Skill.nodes.get_or_none(name=rel.target_name)
    if not student or not skill: return {"error": "Nodes not found"}
    
    student.acquired_skills.connect(skill)
    return {"message": f"Student '{student.name}' acquired skill '{skill.name}'"}

@router.post("/student-pursues-career")
def student_pursues_career(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    career = Career.nodes.get_or_none(title=rel.target_name)
    if not student or not career: return {"error": "Nodes not found"}
    
    student.careers.connect(career)
    return {"message": f"Student '{student.name}' pursues career '{career.title}'"}

@router.post("/student-interested-in-career")
def student_interested_in_career(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    career = Career.nodes.get_or_none(title=rel.target_name)
    if not student or not career: return {"error": "Nodes not found"}
    
    student.interests_in_careers.connect(career)
    return {"message": f"Student '{student.name}' is interested in career '{career.title}'"}

@router.post("/student-aligns-with-career")
def student_aligns_with_career(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    career = Career.nodes.get_or_none(title=rel.target_name)
    if not student or not career: return {"error": "Nodes not found"}
    
    student.aligns_with_career.connect(career)
    return {"message": f"Student '{student.name}' aligns with career '{career.title}'"}

@router.post("/student-career-goal")
def student_career_goal(rel: RelationshipSchema):
    student = Student.nodes.get_or_none(name=rel.source_name)
    career = Career.nodes.get_or_none(title=rel.target_name)
    if not student or not career: return {"error": "Nodes not found"}
    
    student.goal.connect(career)
    return {"message": f"Student '{student.name}' has a goal of career '{career.title}'"}


# ==========================================
# COURSE RELATIONSHIPS
# ==========================================

@router.post("/course-covers-topic")
def course_covers_topic(rel: RelationshipSchema):
    course = Course.nodes.get_or_none(title=rel.source_name)
    topic = Topic.nodes.get_or_none(name=rel.target_name)
    if not course or not topic: return {"error": "Nodes not found"}
    
    course.covers_topics.connect(topic)
    return {"message": f"Course '{course.title}' covers '{topic.name}'"}

@router.post("/course-teaches-skill")
def course_teaches_skill(rel: RelationshipSchema):
    course = Course.nodes.get_or_none(title=rel.source_name)
    skill = Skill.nodes.get_or_none(name=rel.target_name)
    if not course or not skill: return {"error": "Nodes not found"}
    
    course.teaches_skills.connect(skill)
    return {"message": f"Course '{course.title}' teaches '{skill.name}'"}

@router.post("/course-requires-topic")
def course_requires_topic(rel: RelationshipSchema):
    course = Course.nodes.get_or_none(title=rel.source_name)
    topic = Topic.nodes.get_or_none(name=rel.target_name)
    if not course or not topic: return {"error": "Nodes not found"}
    
    course.required_topic.connect(topic)
    return {"message": f"Course '{course.title}' requires prior topic '{topic.name}'"}

@router.post("/course-recommends-career")
def course_recommends_career(rel: RelationshipSchema):
    course = Course.nodes.get_or_none(title=rel.source_name)
    career = Career.nodes.get_or_none(title=rel.target_name)
    if not course or not career: return {"error": "Nodes not found"}
    
    course.recommends_career.connect(career)
    return {"message": f"Course '{course.title}' recommends career '{career.title}'"}


# ==========================================
# CAREER, TOPIC, AND SKILL RELATIONSHIPS
# ==========================================

@router.post("/career-requires-skill")
def career_requires_skill(rel: RelationshipSchema):
    career = Career.nodes.get_or_none(title=rel.source_name)
    skill = Skill.nodes.get_or_none(name=rel.target_name)
    if not career or not skill: return {"error": "Nodes not found"}
    
    career.requires_skills.connect(skill)
    return {"message": f"Career '{career.title}' requires skill '{skill.name}'"}

@router.post("/topic-develops-skill")
def topic_develops_skill(rel: RelationshipSchema):
    topic = Topic.nodes.get_or_none(name=rel.source_name)
    skill = Skill.nodes.get_or_none(name=rel.target_name)
    if not topic or not skill: return {"error": "Nodes not found"}
    
    topic.develops_skills.connect(skill)
    return {"message": f"Topic '{topic.name}' develops skill '{skill.name}'"}

@router.post("/skill-applies-to-topic")
def skill_applies_to_topic(rel: RelationshipSchema):
    skill = Skill.nodes.get_or_none(name=rel.source_name)
    topic = Topic.nodes.get_or_none(name=rel.target_name)
    if not skill or not topic: return {"error": "Nodes not found"}
    
    skill.applies_to_topics.connect(topic)
    return {"message": f"Skill '{skill.name}' applies to topic '{topic.name}'"}



@router.get("/cliques/student-course-career")
def find_ogm_cliques():
    """
    Finds 3-node cliques (Triangles) using strictly neomodel OGM.
    Clique pattern: Student -> Course -> Career <- Student
    """
    cliques = []
    
    all_students = Student.nodes.all() 
    
    for student in all_students:
        enrolled_courses = student.courses.all()
        pursued_careers = student.careers.all()
        

        for course in enrolled_courses:
            
          
            recommended_careers = course.recommends_career.all()
            

            for career in recommended_careers:
                if career in pursued_careers:
                    cliques.append({
                        "student": student.name,
                        "course": course.title,
                        "career": career.title
                    })
                    
    return {
        "clique_type": "Student -> Course -> Career",
        "total_found": len(cliques),
        "cliques": cliques
    }


@router.get("/all")
def get_full_graph():
    """
    Fetches the graph nodes and core links for visualization.
    """
    nodes = []
    links = []

    # Students
    for student in Student.nodes.all():
        nodes.append({"id": student.name, "name": student.name, "type": "students"})
        
        # Course connections
        for course in student.courses.all():
            links.append({"source": student.name, "target": course.title, "label": "ENROLLED_IN"})
        
        # Topic connections
        for topic in student.interests_in_topics.all():
            links.append({"source": student.name, "target": topic.name, "label": "INTERESTED_IN"})
        for topic in student.topics.all():
            links.append({"source": student.name, "target": topic.name, "label": "HAS_TOPIC"})
            
        # Skill connections
        for skill in student.skills.all():
            links.append({"source": student.name, "target": skill.name, "label": "HAS_SKILL"})
        for skill in student.acquired_skills.all():
            links.append({"source": student.name, "target": skill.name, "label": "ACQUIRED_SKILL"})

        # Career connections
        for career in student.goal.all():
            links.append({"source": student.name, "target": career.title, "label": "HAS_CAREER_GOAL"})
        for career in student.careers.all():
            links.append({"source": student.name, "target": career.title, "label": "PURSUES"})
        for career in student.interests_in_careers.all():
            links.append({"source": student.name, "target": career.title, "label": "INTERESTED_IN"})
        for career in student.aligns_with_career.all():
            links.append({"source": student.name, "target": career.title, "label": "ALIGNS_WITH"})

    # Courses
    for course in Course.nodes.all():
        nodes.append({"id": course.title, "name": course.title, "type": "courses"})
        
        for topic in course.covers_topics.all():
            links.append({"source": course.title, "target": topic.name, "label": "COVERS"})
        for topic in course.required_topic.all():
            links.append({"source": course.title, "target": topic.name, "label": "REQUIRES_PRIOR"})
        for skill in course.teaches_skills.all():
            links.append({"source": course.title, "target": skill.name, "label": "TEACHES"})
        for career in course.recommends_career.all():
            links.append({"source": course.title, "target": career.title, "label": "RECOMMENDS"})

    # Topics
    for topic in Topic.nodes.all():
        nodes.append({"id": topic.name, "name": topic.name, "type": "topics"})
        
        for skill in topic.develops_skills.all():
            links.append({"source": topic.name, "target": skill.name, "label": "DEVELOPS"})

    # Skills
    for skill in Skill.nodes.all():
        nodes.append({"id": skill.name, "name": skill.name, "type": "skills"})
        
        for topic in skill.applies_to_topics.all():
            links.append({"source": skill.name, "target": topic.name, "label": "APPLIES_TO"})

    # Careers
    for career in Career.nodes.all():
        nodes.append({"id": career.title, "name": career.title, "type": "careers"})
        
        for skill in career.requires_skills.all():
            links.append({"source": career.title, "target": skill.name, "label": "REQUIRES"})

    return {"nodes": nodes, "links": links}