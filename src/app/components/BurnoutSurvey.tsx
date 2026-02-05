"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Button } from "@/app/components/ui/button"
import { 
  saveBurnoutSurvey, 
  getBurnoutSurvey, 
  calculateBurnoutScores,
  type BurnoutSurveyResponse,
  type BurnoutSurveyScores
} from "@/lib/actions/burnout-survey"

const OLBI_QUESTIONS = [
  "I always find new and interesting aspects in my work",
  "There are days when I feel tired before I arrive at work",
  "It happens more and more often that I talk about my work in a negative way",
  "After work, I tend to need more time than in the past in order to relax and feel better",
  "I can tolerate the pressure of my work very well",
  "Lately, I tend to think less at work and do my job almost mechanically",
  "I find my work to be a positive challenge",
  "During my work, I often feel emotionally drained",
  "Over time, one can become dis-connected from this type of work",
  "After working, I have enough energy for my leisure activities",
  "Sometimes I feel sickened by my work tasks",
  "After my work, I usually feel worn out and weary"
]

const RESPONSE_OPTIONS = [
  { value: "1", label: "Strongly Agree (+1)" },
  { value: "2", label: "Agree (+2)" },
  { value: "3", label: "Disagree (+3)" },
  { value: "4", label: "Strongly Disagree (+4)" }
]

type TabType = "purpose" | "keyFacts" | "contents"

export default function BurnoutSurvey() {
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("purpose")
  const [scores, setScores] = useState<BurnoutSurveyScores | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    loadSurveyData()
  }, [])

  const loadSurveyData = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const result = await getBurnoutSurvey()
      
      if (result.success) {
        if (result.data) {
          const responseMap: Record<number, number> = {}
          result.data.responses.forEach(response => {
            responseMap[response.questionNumber] = response.responseValue
          })
          setResponses(responseMap)
          
          // Calculate and show scores if survey is completed
          if (result.data.responses.length === 12) {
            const calculatedScores = await calculateBurnoutScores(result.data.responses)
            setScores(calculatedScores)
            setShowResults(true)
          }
        } else {
          // No data yet, but that's okay - show empty form
          setResponses({})
        }
      } else {
        // Handle error from server action
        const errorMsg = result.error || "Failed to load survey data"
        setLoadError(errorMsg)
        // Still show the form even if loading fails
        setResponses({})
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setLoadError(errorMessage)
      // Still show the form even if there's an error
      setResponses({})
    } finally {
      setIsLoading(false)
    }
  }

  const handleResponseChange = async (questionNumber: number, value: string) => {
    const responseValue = parseInt(value, 10)
    const updatedResponses = {
      ...responses,
      [questionNumber]: responseValue
    }
    setResponses(updatedResponses)
    setSaveMessage(null)
    
    // Auto-calculate scores if all 12 questions are answered
    const allAnswered = Array.from({ length: 12 }, (_, i) => i + 1).every(
      qNum => updatedResponses[qNum] !== undefined && updatedResponses[qNum] >= 1 && updatedResponses[qNum] <= 4
    )
    
    if (allAnswered) {
      const surveyResponses: BurnoutSurveyResponse[] = Array.from({ length: 12 }, (_, i) => ({
        questionNumber: i + 1,
        responseValue: updatedResponses[i + 1]
      }))
      
      // Calculate scores in real-time
      const calculatedScores = await calculateBurnoutScores(surveyResponses)
      setScores(calculatedScores)
      setShowResults(true)
    } else if (showResults) {
      // Hide results if not all questions are answered
      setShowResults(false)
      setScores(null)
    }
  }

  const handleSubmit = async () => {
    // Validate all questions are answered
    const allAnswered = Array.from({ length: 12 }, (_, i) => i + 1).every(
      qNum => responses[qNum] !== undefined && responses[qNum] >= 1 && responses[qNum] <= 4
    )

    if (!allAnswered) {
      setSaveMessage({ type: "error", text: "Please answer all 12 questions before submitting." })
      return
    }

    try {
      setIsSaving(true)
      setSaveMessage(null)

      const surveyResponses: BurnoutSurveyResponse[] = Array.from({ length: 12 }, (_, i) => ({
        questionNumber: i + 1,
        responseValue: responses[i + 1]
      }))

      const result = await saveBurnoutSurvey(surveyResponses)

      if (result.success) {
        setSaveMessage({ type: "success", text: "Survey responses saved successfully!" })
        
        // Calculate and display scores from the saved responses
        // Use the current responses state to ensure we have the latest values
        const currentSurveyResponses: BurnoutSurveyResponse[] = Array.from({ length: 12 }, (_, i) => ({
          questionNumber: i + 1,
          responseValue: responses[i + 1]
        }))
        
        const calculatedScores = await calculateBurnoutScores(currentSurveyResponses)
        setScores(calculatedScores)
        setShowResults(true)
      } else {
        setSaveMessage({ type: "error", text: result.error || "Failed to save survey responses." })
      }
    } catch (error) {
      console.error("Error saving survey:", error)
      setSaveMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSaving(false)
    }
  }

  const getScoreInterpretation = (average: number): { level: string; color: string; description: string } => {
    if (average <= 2.0) {
      return { 
        level: "Low", 
        color: "text-green-600", 
        description: "Low burnout risk" 
      }
    } else if (average <= 2.5) {
      return { 
        level: "Moderate", 
        color: "text-yellow-600", 
        description: "Moderate burnout risk" 
      }
    } else if (average <= 3.0) {
      return { 
        level: "High", 
        color: "text-orange-600", 
        description: "High burnout risk" 
      }
    } else {
      return { 
        level: "Very High", 
        color: "text-red-600", 
        description: "Very high burnout risk" 
      }
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading survey...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show error message but still render the form
  // This allows users to fill out the survey even if loading previous data failed

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="mb-2">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Burnout Survey
          </CardTitle>
        </div>
        <p className="text-slate-600 text-sm">
          Helps evaluate burnout severity based on exhaustion and disengagement statements.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("purpose")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "purpose"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Purpose
          </button>
          <button
            onClick={() => setActiveTab("keyFacts")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "keyFacts"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Key Facts
          </button>
          <button
            onClick={() => setActiveTab("contents")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "contents"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Contents
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4 text-sm text-slate-700">
          {activeTab === "purpose" && (
            <p>
              The Oldenburg Burnout Inventory (OLBI) is a validated psychological assessment tool 
              designed to measure burnout through two core dimensions: exhaustion and disengagement. 
              This survey helps identify burnout severity and provides insights into work-related stress levels.
            </p>
          )}
          {activeTab === "keyFacts" && (
            <div className="space-y-2">
              <p><strong>• Two Subscales:</strong> Exhaustion (6 questions) and Disengagement (6 questions)</p>
              <p><strong>• Scoring Range:</strong> 1 (Strongly Agree) to 4 (Strongly Disagree)</p>
              <p><strong>• Higher Scores:</strong> Indicate higher levels of burnout</p>
              <p><strong>• Reverse Scoring:</strong> Some positive statements are reverse-scored</p>
              <p><strong>• Completion Time:</strong> Approximately 5-10 minutes</p>
            </div>
          )}
          {activeTab === "contents" && (
            <div className="space-y-2">
              <p><strong>Survey Structure:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>12 statements about work-related feelings and experiences</li>
                <li>4-point Likert scale response options</li>
                <li>Automatic calculation of exhaustion and disengagement scores</li>
                <li>Results interpretation based on validated thresholds</li>
              </ul>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Load Error Message */}
        {loadError && (
          <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded">
            <p className="text-sm">
              <strong>Note:</strong> {loadError} You can still fill out the survey below.
            </p>
            <Button 
              onClick={loadSurveyData} 
              className="mt-2 text-sm bg-yellow-600 hover:bg-yellow-700 text-white"
              size="sm"
            >
              Try Loading Again
            </Button>
          </div>
        )}

        {/* Results Section */}
        {showResults && scores && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Burnout Assessment Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-white rounded border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Exhaustion Score</p>
                <p className="text-2xl font-bold text-slate-900">{scores.exhaustionAverage}</p>
                <p className={`text-sm font-medium ${getScoreInterpretation(scores.exhaustionAverage).color}`}>
                  {getScoreInterpretation(scores.exhaustionAverage).level} - {getScoreInterpretation(scores.exhaustionAverage).description}
                </p>
              </div>
              
              <div className="p-3 bg-white rounded border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Disengagement Score</p>
                <p className="text-2xl font-bold text-slate-900">{scores.disengagementAverage}</p>
                <p className={`text-sm font-medium ${getScoreInterpretation(scores.disengagementAverage).color}`}>
                  {getScoreInterpretation(scores.disengagementAverage).level} - {getScoreInterpretation(scores.disengagementAverage).description}
                </p>
              </div>
              
              <div className="p-3 bg-white rounded border border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Overall Average</p>
                <p className="text-2xl font-bold text-slate-900">{scores.totalAverage}</p>
                <p className={`text-sm font-medium ${getScoreInterpretation(scores.totalAverage).color}`}>
                  {getScoreInterpretation(scores.totalAverage).level} - {getScoreInterpretation(scores.totalAverage).description}
                </p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 italic">
              Note: These scores are for informational purposes only and should not replace professional medical advice.
            </p>
          </div>
        )}

        {/* Survey Questions */}
        <div className="space-y-4">
          {OLBI_QUESTIONS.map((question, index) => {
            const questionNumber = index + 1
            const currentValue = responses[questionNumber]?.toString() || ""
            
            return (
              <div key={questionNumber} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-700 text-white rounded flex items-center justify-center font-semibold">
                  {questionNumber}
                </div>
                <div className="flex-1">
                  <p className="text-slate-900 mb-2">{question}</p>
                  <Select
                    value={currentValue}
                    onValueChange={(value) => handleResponseChange(questionNumber, value)}
                  >
                    <SelectTrigger className="w-full max-w-xs border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Select</SelectItem>
                      {RESPONSE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )
          })}
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mt-4 p-3 rounded ${
            saveMessage.type === "success" 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {saveMessage.text}
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSaving ? "Saving..." : "Save Survey Responses"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
