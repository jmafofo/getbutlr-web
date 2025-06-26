import { parseLocationFromTitleOrDesc } from '@/lib/geoParser';

export function generateLocationAwareChecklist(title: string, description: string) {
  const location = parseLocationFromTitleOrDesc(title, description);

  return {
    location,
    checklist: [
      `✅ Include "${location}" in your title and first 150 characters of description`,
      `✅ Mention "${location}" in your spoken audio and subtitles`,
      `✅ Use 2–3 location-based hashtags, e.g. #${location.replace(/\s/g, '')}`,
      `✅ Add "${location}" to your video tags for better discoverability`,
      `✅ Mention nearby landmarks or events for SEO enrichment`,
    ],
  };
}

