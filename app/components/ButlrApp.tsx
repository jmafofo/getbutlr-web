/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */


import { useState, useEffect } from "react"
import { createClient, User } from "@supabase/supabase-js"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { Card, CardContent } from "../components/ui/Card"
// import { Textarea } from "@/components/ui/Textarea"

interface QuizAnswers {
  q1: string
  q2: string
  q3: string
}

interface Results {
  titles: string[]
  hashtags: string[]
  thumbnail: {
    suggested_text: string
    visual_hook: string
    emotion: string
  }
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function ButlrApp() {
//   const [videoTopic, setVideoTopic] = useState<string>("")
//   const [platform, setPlatform] = useState<string>("YouTube")
//   const [style, setStyle] = useState<string>("epic")
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showQuiz, setShowQuiz] = useState<boolean>(true)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({ q1: "", q2: "", q3: "" })
  const [growthPlan, setGrowthPlan] = useState<string>("")

  useEffect(() => {
    const fetchUserAndQuiz = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
      if (data?.user) {
        const { data: quizData } = await supabase
          .from("creator_profiles")
          .select("quiz_q1, quiz_q2, quiz_q3, growth_plan")
          .eq("user_id", data.user.id)
          .single()
        if (quizData) {
          setQuizAnswers({
            q1: quizData.quiz_q1 || "",
            q2: quizData.quiz_q2 || "",
            q3: quizData.quiz_q3 || ""
          })
          setGrowthPlan(quizData.growth_plan)
          setShowQuiz(false)
        }
      }
    }
    fetchUserAndQuiz()
  }, [])

  const handleGenerate = async () => {
    if (!user) return alert("Please log in to use Butlr's content tools.")
    setLoading(true)
    const mockResponse: Results = {
      titles: [
        "Bonito vs Ultralight Gear – Deep Sea Chaos!",
        "Microrod, Monster Fish – You Won’t Believe It",
        "Ultralight Madness: Bonito Battle Offshore!"
      ],
      hashtags: [
        "#ultralightfishing",
        "#bonitofishing",
        "#deepseafishing",
        "#saltwaterlife",
        "#pennreels"
      ],
      thumbnail: {
        suggested_text: "ULTRA vs MONSTER",
        visual_hook: "Bent rod + fish splash at boat-side",
        emotion: "Shock and awe; ocean blue and red highlights"
      }
    }
    setTimeout(() => {
      setResults(mockResponse)
      setLoading(false)
    }, 1000)
  }

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return alert(error.message)
    setUser(data.user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleQuizSubmit = async () => {
    const { q1, q2, q3 } = quizAnswers
    let plan = ""

    if (q1 === "Low" || q2 === "Rarely" || q3 === "No") {
      plan = "🧠 1-week creative mindset reboot: Daily short-form content exercises, watch top trending creators for 15 mins/day, and journal 1 idea per night."
    } else {
      plan = "🚀 4-week growth accelerator: Weekly upload plan, AI workflow integration, audience engagement checklist, and title testing."
    }
    setGrowthPlan(plan)
    setShowQuiz(false)

    if (user) {
      await supabase.from("creator_profiles").upsert({
        user_id: user.id,
        quiz_q1: q1,
        quiz_q2: q2,
        quiz_q3: q3,
        growth_plan: plan
      }, { onConflict: "user_id" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Butlr
        </h1>
        <p className="text-lg mt-2 text-slate-300">
          Built for Creators. Ready for Every Platform.
        </p>
      </div>

      {/* Auth Section or Quiz */}
      {!user ? (
        <Card className="mb-6 bg-slate-900/60 backdrop-blur-md border border-slate-700 shadow-lg">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-bold text-cyan-300">Sign in to continue</h2>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-800 border border-slate-700 placeholder-slate-400" />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-800 border border-slate-700 placeholder-slate-400" />
            <Button onClick={handleLogin} className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold">Sign In</Button>
          </CardContent>
        </Card>
      ) : showQuiz ? (
        <Card id="quiz-section" className="mb-6 bg-slate-900/60 border border-slate-700">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-bold text-yellow-300">Let's get to know your creator profile</h2>
            <div className="space-y-2">
              <label>How would you rate your current creative confidence?</label>
              <select value={quizAnswers.q1} onChange={(e) => setQuizAnswers({ ...quizAnswers, q1: e.target.value })} className="text-black">
                <option value="">Select</option>
                <option>High</option>
                <option>Moderate</option>
                <option>Low</option>
              </select>
              <label>How often do you create new content?</label>
              <select value={quizAnswers.q2} onChange={(e) => setQuizAnswers({ ...quizAnswers, q2: e.target.value })} className="text-black">
                <option value="">Select</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Rarely</option>
              </select>
              <label>Do you feel you have a unique voice as a creator?</label>
              <select value={quizAnswers.q3} onChange={(e) => setQuizAnswers({ ...quizAnswers, q3: e.target.value })} className="text-black">
                <option value="">Select</option>
                <option>Yes</option>
                <option>Sometimes</option>
                <option>No</option>
              </select>
              <Button onClick={handleQuizSubmit} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">Submit Quiz</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <></>
      )}

      {/* Additional content such as results and user manual would go here */}
      {/* This placeholder can be expanded with more JSX sections */}

      {/* Footer */}
      <footer className="mt-12 text-slate-400 text-sm max-w-4xl mx-auto border-t border-slate-700 pt-10">
        <p className="text-center">&copy; {new Date().getFullYear()} Butlr. All rights reserved.</p>
      </footer>
    </div>
  )
}
