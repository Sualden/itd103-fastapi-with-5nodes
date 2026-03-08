from pydantic import BaseModel
from neomodel import (
    StructuredNode,
    StringProperty,
    RelationshipTo,
    RelationshipFrom
)

# --- Schemas ---
class StudentSchema(BaseModel):
    name: str

class CourseSchema(BaseModel):
    title: str

class TopicSchema(BaseModel):
    name: str

class SkillSchema(BaseModel):
    name: str

class CareerSchema(BaseModel):
    title: str

class RelationshipSchema(BaseModel):
    source_name: str
    target_name: str


# --- OGM Models ---

class Topic(StructuredNode):
    name = StringProperty(unique_index=True, required=True)
    covered_by = RelationshipFrom('Course', 'COVERS')
    relevant_to_careers = RelationshipFrom('Career', 'RELEVANT_TO')
    develops_skills = RelationshipTo('Skill', 'DEVELOPS')
    # Added reciprocal relationships for easy querying
    applied_by_skills = RelationshipFrom('Skill', 'APPLIES_TO')


class Skill(StructuredNode):
    name = StringProperty(unique_index=True, required=True)
    taught_by = RelationshipFrom('Course', 'TEACHES')
    required_by = RelationshipFrom('Career', 'REQUIRES')
    
    # FIX: Changed to RelationshipTo so Skill -> Topic
    applies_to_topics = RelationshipTo('Topic', 'APPLIES_TO')


class Career(StructuredNode):
    title = StringProperty(unique_index=True, required=True)
    
    # FIX: Removed the duplicate requires_skills
    requires_skills = RelationshipTo('Skill', 'REQUIRES')
    
    pursued_by = RelationshipFrom('Student', 'PURSUES')
    
    # FIX: Typo in RECOMMENDS. Also, assuming Course -> Career
    recommended_by_courses = RelationshipFrom('Course', 'RECOMMENDS')
    
    # FIX: Students are interested in careers, and aligned with careers
    interested_students = RelationshipFrom('Student', 'INTERESTED_IN')
    aligned_students = RelationshipFrom('Student', 'ALIGNS_WITH')
    student_goals = RelationshipFrom('Student', 'HAS_CAREER_GOAL')


class Course(StructuredNode):
    title = StringProperty(unique_index=True, required=True)
    covers_topics = RelationshipTo('Topic', 'COVERS')
    teaches_skills = RelationshipTo('Skill', 'TEACHES')
    enrolled_students = RelationshipFrom('Student', 'ENROLLED_IN')
    required_topic = RelationshipTo('Topic', 'REQUIRES_TOPIC')
    
    # Added relationship if Course recommends a Career
    recommends_career = RelationshipTo('Career', 'RECOMMENDS')


class Student(StructuredNode):
    name = StringProperty(unique_index=True, required=True)
    courses = RelationshipTo('Course', 'ENROLLED_IN')
    skills = RelationshipTo('Skill', 'HAS_SKILL')
    careers = RelationshipTo('Career', 'PURSUES')
    
    # Topic relationships
    topics = RelationshipTo('Topic', 'HAS_TOPIC')
    interests_in_topics = RelationshipTo('Topic', 'INTERESTED_IN')
    
    # FIX: Spelling
    acquired_skills = RelationshipTo('Skill', 'ACQUIRED_SKILL')
    
    # Career relationships moved from Course to Student based on diagram
    interests_in_careers = RelationshipTo('Career', 'INTERESTED_IN')
    aligns_with_career = RelationshipTo('Career', 'ALIGNS_WITH')
    
    # FIX: Capitalization
    goal = RelationshipTo('Career', 'HAS_CAREER_GOAL')