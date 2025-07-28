// File: lib/keywordUtils.ts

import { google } from 'googleapis';
import axios from 'axios';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

/**
 * Returns a list of trending or relevant keywords for the given seed title.
 */
export async function getTrendingKeywords(seed: string): Promise<string[]> {
  try {
    const yt = await youtube.search.list({
      q: seed,
      part: ['snippet'],
      type: ['video'],
      order: 'viewCount',
      maxResults: 5,
    });
    return (yt.data.items || []).map(item =>
      item.snippet?.title?.split(' ').slice(0, 5).join(' ') || ''
    );
  } catch (e) {
    // Fallback: use Google Trends if YouTube API fails
    const resp = await axios.get(
      `https://trends.google.com/trends/api/autocomplete/${encodeURIComponent(seed)}`
    );
    const list = resp.data?.default?.topics || [];
    return list.map((t: { title: string }) => t.title);
  }
}