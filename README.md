ITD103 Knowledge Graph API 🕸️
Student: [Your Name Here]

Project: ITD103 Graph Database Applications

Architecture: Client-Server (FastAPI Backend + React Frontend)

📖 Project Overview
This project is a centralized Knowledge Graph API built with FastAPI that manages interconnected data using a Neo4j graph database. Instead of traditional isolated relational tables, this system uses an Object Graph Mapper (neomodel) to map, route, and traverse complex relationships across five distinct entity types, allowing for advanced analytics like AI-driven career recommendations and learning clique detection.

🏗️ Graph Entities (The 5 Core Nodes)
The system maps connections between the following 5 distinct nodes simultaneously:

Student: Represents learners tracking their education and career goals.

Course: Educational programs or classes that teach specific skills.

Topic: High-level subject matter areas (e.g., Programming, Data Science).

Skill: Granular capabilities acquired by students (e.g., Python, SQL).

Career: Professional roles that require specific skills and are recommended by courses.

⚙️ Core Mechanics
The API uses standard JSON payloads containing name or title data. Operations for linking these nodes are controlled via a dropdown Relationship Type parameter in the UI:

Entity Creation: Creates isolated nodes in the database.

Relationship Mapping: The system automatically bridges specific source and target nodes based on the selected route (e.g., Course ➜ RECOMMENDS ➜ Career or Student ➜ ENROLLED_IN ➜ Course).

Path Traversal (Recommendations): The system traverses multi-hop paths to generate insights. For example, it looks at the Courses a Student is enrolled in to find which Careers those courses recommend.

Clique Detection: The system scans the network to find tightly coupled 3-way intersections (e.g., A Student enrolled in a Course, the Course recommending a Career, and the Student pursuing that same Career).

📡 API Endpoints
GET /graph/all - System Data Fetch. Retrieves all nodes and links to render the 2D physics graph.

POST /{entity_type}/ - Inserts new standalone nodes (e.g., /students/, /courses/).

GET /{entity_type}/{name} - Retrieves node data by its unique identifier.

POST /graph/{relationship-route} - Establishes a directional link between two existing nodes.

GET /graph/student/{name}/recommend-careers - Analyzes graph paths to return AI career recommendations.

GET /graph/cliques/student-course-career - Detects and returns 3-node graph triangles using OGM logic.

📝 Example Data Payloads
When using the POST endpoints in the Swagger UI or the React frontend, you must provide a JSON payload.

Example 1: Creating an Entity (Node) Target: POST /students/
JSON

{
  "name": "Alice"
}

Example 2: Creating a Relationship (Edge) Target: POST /graph/student-enrolls-course

JSON

{
  "source_name": "Alice",
  "target_name": "Intro to Python"
}

🛠️ Setup Instructions
1. Create your .env file:
The backend requires the following Neo4j credentials in the backend/ folder. Never commit this file to GitHub!

Code snippet
DATABASE_URL="neo4j+s://<YOUR-USERNAME>:<YOUR-PASSWORD>@<YOUR-NEO4J-URI>"
2. Run the Backend Server:
Start the FastAPI application using Uvicorn:

Bash
cd backend
python main.py
The server will run on http://127.0.0.1:8080. Access the interactive API at http://127.0.0.1:8080/docs.

3. Run the Frontend UI:
Open a new terminal and start the React application:

Bash
cd frontend
npm install
npm run dev
The React UI will run on http://localhost:5173.
