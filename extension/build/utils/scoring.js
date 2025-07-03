export function scoreTitle(title) {
  if (!title) return 0;
  const length = title.length;
  const keywords = ['how', 'best', 'top', 'vs', 'tutorial', 'review'];
  const keywordBoost = keywords.some(word => title.toLowerCase().includes(word)) ? 20 : 0;
  const lengthScore = length >= 30 && length <= 70 ? 80 : 40;
  return Math.min(100, lengthScore + keywordBoost);
}

export function scoreTags(tags = []) {
  if (!tags.length) return 0;
  const idealTagCount = 10;
  const coverageScore = Math.min((tags.length / idealTagCount) * 100, 100);
  return Math.round(coverageScore);
}

export function scoreDescription(desc) {
  if (!desc) return 0;
  const lengthScore = desc.length > 100 ? 60 : 30;
  const hasCTA = /subscribe|like|comment|share/i.test(desc) ? 20 : 0;
  const hasKeywords = /how|why|what|top|best|review/i.test(desc) ? 20 : 0;
  return lengthScore + hasCTA + hasKeywords;
}
