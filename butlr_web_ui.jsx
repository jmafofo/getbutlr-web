// Butlr Web App Interface – Enhanced Styling, Branding, Authentication, and Quiz Logic

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const supabaseUrl = "https://your-supabase-url.supabase.co"
const supabaseAnonKey = "your-public-anon-key"
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function ButlrApp() {
  const [videoTopic, setVideoTopic] = useState("")
  const [platform, setPlatform] = useState("YouTube")
  const [style, setStyle] = useState("epic")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showQuiz, setShowQuiz] = useState(true)
  const [quizAnswers, setQuizAnswers] = useState({ q1: "", q2: "", q3: "" })
  const [growthPlan, setGrowthPlan] = useState("")

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

    const mockResponse = {
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
      }, { onConflict: ["user_id"] })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Butlr
        </h1>
        <p className="text-lg mt-2 text-slate-300">
          Built for Creators. Ready for Every Platform.
        </p>
      </div>

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
        <>
          <div className="text-right mb-4">
            <span className="text-slate-300 mr-4">Signed in as {user.email}</span>
            <Button onClick={handleLogout} variant="outline">Log out</Button>
          </div>

          {growthPlan && (
            <Card className="mb-6 bg-green-900/60 border border-green-700">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-green-300 mb-2">🎯 Your Growth Plan</h2>
                <p className="text-green-100 whitespace-pre-line">{growthPlan}</p>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6 bg-slate-900/60 backdrop-blur-md border border-slate-700 shadow-lg">
            <CardContent className="space-y-4 p-6">
              <Textarea placeholder="What's your video about?" value={videoTopic} onChange={(e) => setVideoTopic(e.target.value)} className="bg-slate-800 border border-slate-700 placeholder-slate-400" />
              <div className="flex flex-col sm:flex-row gap-4">
                <Input placeholder="Platform (YouTube, TikTok...)" value={platform} onChange={(e) => setPlatform(e.target.value)} className="bg-slate-800 border border-slate-700 placeholder-slate-400" />
                <Input placeholder="Style (epic, funny...)" value={style} onChange={(e) => setStyle(e.target.value)} className="bg-slate-800 border border-slate-700 placeholder-slate-400" />
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold">
                {loading ? "Generating..." : "Generate Content"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {results && (
        <div className="space-y-6">
          <Card className="bg-slate-900/60 border border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-cyan-400 mb-3">🎯 Titles</h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-200">
                {results.titles.map((title, i) => (
                  <li key={i}>{title}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-purple-400 mb-3">🏷️ Hashtags</h2>
              <p className="text-slate-200">{results.hashtags.join(" ")}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/60 border border-slate-700">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold text-pink-400 mb-3">📸 Thumbnail Hook</h2>
              <p><strong>Text:</strong> {results.thumbnail.suggested_text}</p>
              <p><strong>Visual:</strong> {results.thumbnail.visual_hook}</p>
              <p><strong>Emotion/Style:</strong> {results.thumbnail.emotion}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-12 text-slate-400 text-sm max-w-4xl mx-auto">
        <div className="mt-20 border-t border-slate-700 pt-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">🚀 Why Butlr?</h2>
          <div className="space-y-6 text-slate-300 text-center">
            <div>
              <h3 className="text-xl font-semibold text-cyan-300">1. Your AI Content Assistant</h3>
              <p>Take a 1-minute quiz to unlock your growth plan. Butlr learns your style and generates optimized titles, hashtags, and thumbnail hooks—instantly.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-yellow-300">2. Tailored Growth Plans</h3>
              <p>Whether you're a beginner or posting daily, your growth plan adjusts as you do—like having a creative coach in your pocket.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-pink-400">3. Start Free. Grow Fast.</h3>
              <p>Start with our free tools. Upgrade anytime to get unlimited access, smart suggestions, and AI-powered support.</p>
            </div>
            <div className="mt-10">
              <Button onClick={() => document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full text-lg">Start Free & Take the Quiz</Button>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">📖 User Manual</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-cyan-300">Free Plan</h3>
            <ul className="list-disc list-inside">
              <li>Access to title, hashtag, and thumbnail tools</li>
              <li>Limited number of generations per day</li>
              <li>Requires quiz completion for personalized growth</li>
              <li>No project history saving</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-yellow-300">Premium Plan</h3>
            <ul className="list-disc list-inside">
              <li>Unlimited use of all AI content tools</li>
              <li>Save project history and retrieve old outputs</li>
              <li>Monthly growth tracking and adaptive suggestions</li>
              <li>Priority access to new workflow modules</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-pink-400">AI Support</h3>
            <ul className="list-disc list-inside">
              <li>Butlr provides first-level support in-app via smart suggestions</li>
              <li>Ask questions in any field and get AI responses based on creator context</li>
              <li>Premium users can request direct feedback on growth plan progress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
