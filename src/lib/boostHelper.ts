// utils/boostHelper.ts

export type ViewerData = {
    userId: string;
    videoId: string;
    watchDurationRatio: number; // e.g., 0.65 means 65%
  };
  
  export enum AudienceTier {
    TIER_1 = "Tier 1 – Highly Engaged (50%+)",
    TIER_2 = "Tier 2 – Moderately Engaged (30-50%)",
    TIER_3 = "Tier 3 – Lightly Engaged (<30%)",
  }
  
  export function classifyViewerEngagement(viewer: ViewerData): AudienceTier {
    const ratio = viewer.watchDurationRatio;
    if (ratio >= 0.5) return AudienceTier.TIER_1;
    if (ratio >= 0.3) return AudienceTier.TIER_2;
    return AudienceTier.TIER_3;
  }
  