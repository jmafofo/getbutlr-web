// Run this to generate types: 
// npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Your table definitions here
    };
    Views: {
      // Your view definitions here
    };
    Functions: {
      // Your function definitions here
    };
    Enums: {
      // Your enum definitions here
    };
    CompositeTypes: {
      // Your composite type definitions here
    };
  };
}