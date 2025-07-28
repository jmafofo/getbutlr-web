export function stripEmailDomain(email: string | null | undefined): string {
    if (!email) return "Guest User";
  
    return email.replace(/@(gmail\.com|apple\.com|yahoo\.com)$/i, "");
  }  