
export function scoreThumbnail(prompt: string): number {
  let score = 60 + Math.floor(Math.random() * 40);
  if (/faces?|emotion/i.test(prompt)) score += 5;
  if (/contrast|bold|action/i.test(prompt)) score += 10;
  return Math.min(score, 100);
}
