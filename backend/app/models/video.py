from pydantic import BaseModel
from typing import List

class VideoRequest(BaseModel):
    topic: str

class VideoResponse(BaseModel):
    title_suggestions: List[str]
    tags: List[str]
    summary: str
