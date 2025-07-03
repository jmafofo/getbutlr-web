# models/promotion_target.py

from enum import Enum

class AudienceTier(Enum):
    TIER_1 = "Tier 1 – Highly Engaged (50%+ watch duration)"
    TIER_2 = "Tier 2 – Moderately Engaged (30–50% watch duration)"
    TIER_3 = "Tier 3 – Lightly Engaged (<30% watch duration)"

def classify_viewer(watch_durations: list[float]) -> AudienceTier:
    avg_watch = sum(watch_durations) / len(watch_durations)
    if avg_watch >= 0.5:
        return AudienceTier.TIER_1
    elif avg_watch >= 0.3:
        return AudienceTier.TIER_2
    else:
        return AudienceTier.TIER_3

