import os
from neomodel import config
from dotenv import load_dotenv

load_dotenv()
config.DATABASE_URL = os.getenv("DATABASE_URL")