# GetButlr — AI Studio for Creators

**GetButlr** is a powerful AI-powered platform built to empower content creators with tools that analyze, enhance, and optimize videos, metadata, growth strategies, and more. Whether you're on YouTube, Instagram, TikTok, or Facebook — GetButlr is your virtual creative strategist.

## 🚀 Features

- 🎯 **SEO Optimization Tools** (titles, descriptions, tags)
- 🎞️ **Thumbnail Analyzer + Generator**
- 📈 **Content Performance Analyzer**
- 🔍 **Hook Analyzer**
- 🧠 **Smart Idea Generator**
- 🗓️ **Weekly Growth Planner**
- 🗣️ **Voice-to-Script Transcriber**
- 💬 **Comment Insight Tool**
- 🧵 **AI Coaching and Feedback Summaries**
- 📦 **Browser Extension for real-time studio feedback**
- 🔧 **Tag Miner & Keyword Research Engine**

## 📦 Project Structure

app/
├── api/ → API routes (e.g., comment-insights, seo-checklist)
├── components/ → Reusable UI components (ToolHeader, ToolCard, etc.)
├── tools/ → Tool pages (SEO Checklist, Hook Analyzer, etc.)
├── courses/ → Creator Academy modules
├── dashboard/ → User dashboard and subscription pages
├── layout.tsx → App layout
├── page.tsx → Landing page
public/
styles/
utils/

shell
Copy
Edit

## 🧪 Development

### Install dependencies

```bash
npm install
Run development server
bash
Copy
Edit
npm run dev
Visit http://localhost:3000 to view the app.

📦 Build and Deploy
bash
Copy
Edit
npm run build
Deployment via Vercel or similar static hosting platforms is supported.

🔐 Auth & API
Supabase for authentication and data storage

OpenAI for AI content generation and analysis

Optional ad-gating and feature gating by subscription level

🧠 Plans & Pricing
Free Tier – Basic tools with limited usage

Creator+ – Full access to most tools

Studio Pro – Unlocks all tools, bulk optimization, and extension integrations

📄 License
MIT
