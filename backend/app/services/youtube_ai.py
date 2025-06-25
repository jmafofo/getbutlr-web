from app.models.video import VideoRequest, VideoResponse

def analyze_video(data: VideoRequest) -> VideoResponse:
    return VideoResponse(
        title_suggestions=[
            f"Top Secrets About {data.topic}",
            f"{data.topic} Explained Simply"
        ],
        tags=["content", "growth", "strategy"],
        summary=f"This is a mock analysis for topic: {data.topic}"
    )
