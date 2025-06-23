/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from "react"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
import { motion, AnimatePresence } from "framer-motion"
import { generateInsights } from "@/lib/openaiClient";
import { useRouter } from "next/navigation";

interface QuizAnswers {
  [key: string]: string
}

function formatGrowthPlan(plan: string): string {
  // Convert markdown to HTML with proper styling
  let html = plan
    // Headers
    .replace(/^## (.*$)/gm, '<h3 class="text-xl font-semibold text-cyan-300 mb-1">$1</h3>')
    .replace(/^# (.*$)/gm, '<h2 class="text-2xl font-bold text-purple-400 mb-1">$1</h2>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<span class="font-medium text-yellow-300">$1</span>')
    // Italics
    .replace(/\*(.*?)\*/g, '<em class="text-cyan-200">$1</em>')    
    // Lists
    .replace(/^\* (.*$)/gm, '<li class="ml-5">$1</li>')
    .replace(/^\- (.*$)/gm, '<li class="ml-5">$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-5 space-y-2 marker:text-cyan-400">$1</ul>')
    // Phase sections
    .replace(/^Phase (\d+): (.*?) \((.*?)\)/gm, 
      '<div class="phase-section p-5 bg-slate-900/50 rounded-lg border-l-4 border-$3-400 mt-2">' +
      '<h4 class="text-lg font-semibold text-$3-300 mb-2">Phase $1: $2</h4>')    
    // Action items
    .replace(/^\* \*\*(.*?)\*\*:/gm, '<p class="action-item font-medium text-yellow-200">$1:</p>')
    // Add line breaks
    .replace(/\n/g, '<br/>');
  // Close phase sections
  html = html.replace(/Phase \d+:/g, '</div>$&');
  return html;
}

async function generateGrowthPlanWithAI(answers: QuizAnswers): Promise<string> {
  const formatted = Object.entries(answers)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  
  const res = await fetch("/api/growth-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `Generate a personalized growth plan in markdown format with these sections:
              ## Overall Impression
              ## Phase 1: Foundations (Weeks 1-4)
              ## Phase 2: Refinement (Weeks 5-8) 
              ## Phase 3: Growth (Week 9+)
              Include action items with *bold* labels.
              Based on these responses:
              ${formatted}`,
      tone: "motivational"
    })
  });

  const data = await res.json();
  return data.plan || "## Could not generate plan\nWe couldn't generate a plan at this time. Please try again later.";
}

export default function ButlrApp() {
  const [showQuiz, setShowQuiz] = useState<boolean>(true)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({})
  const [growthPlan, setGrowthPlan] = useState<string>("")
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();

  const quizSteps = [
    { key: "q1", question: "How would you rate your current creative confidence?", options: ["High", "Moderate", "Low"] },
    { key: "q2", question: "How often do you create new content?", options: ["Daily", "Weekly", "Rarely"] },
    { key: "q3", question: "Do you feel you have a unique voice as a creator?", options: ["Yes", "Sometimes", "No"] },
    { key: "q4", question: "What type of content do you primarily create?", options: ["Video", "Photo", "Written", "Audio", "Mixed"] },
    { key: "q5", question: "Which platforms do you focus on the most?", options: ["YouTube", "Instagram", "TikTok", "X / Twitter", "Podcast", "Blog", "Other"] },
    { key: "q6", question: "What's your main goal as a creator?", options: ["Monetize", "Grow audience", "Express myself", "Promote business", "Learn and experiment"] },
    { key: "q7", question: "How comfortable are you with using AI tools?", options: ["Very comfortable", "Somewhat familiar", "New to AI tools"] },
    { key: "q8", question: "What's your biggest struggle right now?", options: ["Consistency", "Ideas", "Engagement", "Time", "Tools & Workflow"] },
    { key: "q9", question: "How much time per week do you dedicate to content creation?", options: ["<1 hour", "1–3 hours", "4–7 hours", "8+ hours"] },
    { key: "q10", question: "Would you be open to receiving content suggestions or automation help?", options: ["Yes", "Maybe", "No"] }
  ]

  const handleQuizSubmit = async () => {
    setLoading(true)
    setShowQuiz(false)
    console.log(quizAnswers);
    const plan = await generateGrowthPlanWithAI(quizAnswers)
    setGrowthPlan(plan)
    setLoading(false)
  }

  const handleAnswer = (value: string) => {
    const key = quizSteps[currentStep].key
    setQuizAnswers((prev) => ({ ...prev, [key]: value }))

    if (currentStep < quizSteps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300)
    } else {
      handleQuizSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Butlr
        </h1>
        <p className="text-lg mt-2 text-slate-300">
          Built for Creators. Ready for Every Platform.
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center py-4 mt-5">
          <video
            autoPlay
            loop
            muted
            className="w-54 h-54 object-contain overflow-hidden"
            style={{ backgroundColor: "transparent" }}
          >
            <source src="/loading.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null}

      {showQuiz ? (
        <Card id="quiz-section" className="mx-auto max-w-xl mb-6 bg-slate-900/60 border border-slate-700 overflow-hidden">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-yellow-300 text-center mb-4">Let's get to know you</h2>
            <div className="h-2 w-full bg-slate-700 rounded-full mb-6">
              <motion.div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={quizSteps[currentStep].key}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <p className="text-lg text-white">{quizSteps[currentStep].question}</p>
                <div className="grid gap-3">
                  {quizSteps[currentStep].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="w-full py-3 px-4 bg-slate-800 text-white border border-slate-600 hover:border-slate-800 hover:text-slate-700 transition-colors rounded-xl"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      ) : growthPlan && (
        <div className="bg-slate-800 p-6 rounded-xl text-white border border-slate-700 shadow-lg mb-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-yellow-300 text-center mb-4">Your Personalized Growth Plan</h2>
        <div
          className="markdown-content space-y-6 text-slate-200"
          dangerouslySetInnerHTML={{ __html: formatGrowthPlan(growthPlan) }}
        />
        
        <div className="flex gap-4 justify-center mt-6">
          <button
            className="py-3 px-6 text-white bg-gradient-to-r from-green-300 to-green-400 hover:from-green-500 hover:to-green-700 hover:text-slate-900 transition-all duration-300 ease-in-out rounded-xl"
          >
            Save Plan
          </button>
          <button
            onClick={() => window.location.reload()}
            className="py-3 px-6 text-white bg-gradient-to-r from-rose-200 to-red-300 hover:from-rose-500 hover:to-red-600 hover:text-slate-900 transition-all duration-300 ease-in-out rounded-xl"
          >
            Re-take
          </button>
        </div>
      </div>      
      )}
    </div>
  )
}