# API Logic for targeting YouTube audiences

def analyze_watch_history(watch_data):
    # watch_data: List of dicts with keys 'video_id', 'watch_duration', 'total_duration'
    tiers = {1: [], 2: [], 3: []}
    for item in watch_data:
        if not item.get("total_duration"):
            continue
        ratio = item["watch_duration"] / item["total_duration"]
        if ratio > 0.5:
            tiers[1].append(item)
        elif ratio > 0.3:
            tiers[2].append(item)
        else:
            tiers[3].append(item)
    return tiers
