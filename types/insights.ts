export type InsightData = {
    keywords: string[];
    tags: string[];
    title_variants: string[];
    thumbnail_prompt: string;
    insight: string;
  };
  
export type SavedSuggestion = {
  id: string;
  query: string;
  tone: string;
  created_at: string;
  keywords: string[];
  tags: string[];
};

export type ProfileData = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  has_completed_survey: boolean;
};