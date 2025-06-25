from fastapi import APIRouter, HTTPException
from app.models.video import VideoRequest, VideoResponse
from app.services.youtube_ai import analyze_video

router = APIRouter()

@router.post("/analyze", response_model=VideoResponse)
def analyze(data: VideoRequest):
    try:
        return analyze_video(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
