from fastapi import APIRouter

router = APIRouter()

@router.post("/verify-id")
def verify_id():
    return {"status": "Verification pending"}
