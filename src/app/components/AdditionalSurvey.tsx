"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Checkbox } from "@/app/components/ui/checkbox"
import {
  getAdditionalSurvey,
  saveAdditionalSurvey,
  type AdditionalSurveyData,
} from "@/lib/actions/additional-survey"

const SAAR_OPTIONS = [
  { value: "much_lower", label: "Much lower than predicted (<0.7)" },
  { value: "slightly_lower", label: "Slightly lower than predicted (0.7 to <1)" },
  { value: "about_predicted", label: "About as predicted (around 1.0)" },
  { value: "slightly_higher", label: "Slightly higher than predicted (>1 to 1.3)" },
  { value: "much_higher", label: "Much higher than predicted (>1.3)" },
  { value: "dont_know", label: "Don't know" },
  { value: "not_available", label: "SAAR not available" },
]

const EFFECTIVENESS_OPTIONS = [
  { value: "cost_savings", label: "Cost savings/cost avoidance" },
  { value: "decreased_utilization", label: "Decreased antibiotic utilization" },
  { value: "decreased_cdiff", label: "Decreased Clostridium difficile infection" },
  { value: "decreased_resistance", label: "Decreased rate of drug-resistant organisms" },
  { value: "other", label: "Other (please specify)" },
  { value: "none", label: "Our ASP has not demonstrated any of the above" },
]

export default function AdditionalSurvey() {
  const [formData, setFormData] = useState<AdditionalSurveyData>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [occupiedMode, setOccupiedMode] = useState<"exact" | "percent">("exact")
  const [effectivenessSelections, setEffectivenessSelections] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const result = await getAdditionalSurvey()
      if (result.success && result.data) {
        setFormData(result.data)
        if (result.data.occupiedBedsPercent != null) setOccupiedMode("percent")
        setEffectivenessSelections(result.data.effectivenessOptions ?? [])
      }
    } catch {
      setFormData({})
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = <K extends keyof AdditionalSurveyData>(
    key: K,
    value: AdditionalSurveyData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setSaveMessage(null)
  }

  const handleEffectivenessChange = (value: string, checked: boolean) => {
    const next = checked
      ? [...effectivenessSelections, value]
      : effectivenessSelections.filter((v) => v !== value)
    setEffectivenessSelections(next)
    updateField("effectivenessOptions", next)
    setSaveMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveMessage(null)
    setIsSaving(true)
    try {
      const payload: AdditionalSurveyData = {
        ...formData,
        effectivenessOptions: effectivenessSelections,
        occupiedBedsCount: occupiedMode === "exact" ? formData.occupiedBedsCount : null,
        occupiedBedsPercent: occupiedMode === "percent" ? formData.occupiedBedsPercent : null,
      }
      const result = await saveAdditionalSurvey(payload)
      if (result.success) {
        setSaveMessage({ type: "success", text: "Survey responses saved successfully." })
      } else {
        setSaveMessage({ type: "error", text: result.error || "Failed to save." })
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to save." })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6">
          <p className="text-slate-600">Loading survey…</p>
        </CardContent>
      </Card>
    )
  }

  const QuestionBlock = ({
    num,
    title,
    children,
  }: {
    num: number
    title: string
    children: React.ReactNode
  }) => (
    <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-semibold text-sm">
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">{title}</h3>
        {children}
      </div>
    </div>
  )

  return (
    <Card className="mt-8 shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Q1 */}
          <QuestionBlock
            num={1}
            title="How many licensed beds does your hospital have?"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                placeholder="Enter number"
                value={formData.licensedBeds ?? ""}
                onChange={(e) =>
                  updateField(
                    "licensedBeds",
                    e.target.value ? parseInt(e.target.value, 10) : null
                  )
                }
                className="w-28"
              />
              <span className="text-slate-500 text-sm">beds</span>
            </div>
          </QuestionBlock>

          {/* Q2 */}
          <QuestionBlock
            num={2}
            title="On a typical day in your hospital, how many beds are occupied?"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">If you know the exact number:</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    placeholder="0"
                    value={
                      occupiedMode === "exact"
                        ? (formData.occupiedBedsCount ?? "")
                        : ""
                    }
                    onChange={(e) => {
                      setOccupiedMode("exact")
                      updateField(
                        "occupiedBedsCount",
                        e.target.value ? parseInt(e.target.value, 10) : null
                      )
                      updateField("occupiedBedsPercent", null)
                    }}
                    className="w-28"
                  />
                  <span className="text-slate-500 text-sm">beds</span>
                </div>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                <p className="text-xs text-slate-500 mb-2">Or, if you don&apos;t know the exact number, enter your best estimate:</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    step={0.1}
                    placeholder="0"
                    value={
                      occupiedMode === "percent"
                        ? (formData.occupiedBedsPercent ?? "")
                        : ""
                    }
                    onChange={(e) => {
                      setOccupiedMode("percent")
                      updateField(
                        "occupiedBedsPercent",
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                      updateField("occupiedBedsCount", null)
                    }}
                    className="w-28"
                  />
                  <span className="text-slate-500 text-sm">% of licensed beds</span>
                </div>
              </div>
            </div>
          </QuestionBlock>

          {/* Q3 */}
          <QuestionBlock
            num={3}
            title="How many ICU beds does your hospital have?"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                placeholder="Enter number"
                value={formData.icuBeds ?? ""}
                onChange={(e) =>
                  updateField(
                    "icuBeds",
                    e.target.value ? parseInt(e.target.value, 10) : null
                  )
                }
                className="w-28"
              />
              <span className="text-slate-500 text-sm">beds</span>
            </div>
          </QuestionBlock>

          {/* Q4 */}
          <QuestionBlock
            num={4}
            title="What is your current FTE (full‑time equivalent) dedicated to antimicrobial stewardship? (Enter a number between 0 and 1)"
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={1}
                step={0.01}
                placeholder="e.g. 0.5"
                value={formData.aspFte ?? ""}
                onChange={(e) =>
                  updateField(
                    "aspFte",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
                className="w-28"
              />
              <span className="text-slate-500 text-sm">FTE</span>
            </div>
          </QuestionBlock>

          {/* Q5 */}
          <QuestionBlock
            num={5}
            title="What are the TOTAL current FTEs for each position dedicated to antimicrobial stewardship in your hospital (including yourself)?"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-600">
                    <th className="text-left py-2 pr-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                    <th className="text-left py-2 pr-2 text-xs font-medium text-slate-500 uppercase tracking-wider w-24">FTE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr>
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">Pharmacist</td>
                    <td className="py-2">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0"
                        value={formData.pharmacistFte ?? ""}
                        onChange={(e) =>
                          updateField(
                            "pharmacistFte",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        className="w-full"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">Physician</td>
                    <td className="py-2">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="0"
                        value={formData.physicianFte ?? ""}
                        onChange={(e) =>
                          updateField(
                            "physicianFte",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        className="w-full"
                      />
                    </td>
                  </tr>
                  {[1, 2, 3].map((i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4">
                        <Input
                          type="text"
                          placeholder="Other (specify)"
                          value={
                            i === 1
                              ? formData.other1Specify ?? ""
                              : i === 2
                                ? formData.other2Specify ?? ""
                                : formData.other3Specify ?? ""
                          }
                          onChange={(e) =>
                            updateField(
                              i === 1 ? "other1Specify" : i === 2 ? "other2Specify" : "other3Specify",
                              e.target.value
                            )
                          }
                          className="w-full placeholder:text-slate-400"
                        />
                      </td>
                      <td className="py-2">
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          placeholder="0"
                          value={
                            i === 1
                              ? formData.other1Fte ?? ""
                              : i === 2
                                ? formData.other2Fte ?? ""
                                : formData.other3Fte ?? ""
                          }
                          onChange={(e) =>
                            updateField(
                              i === 1 ? "other1Fte" : i === 2 ? "other2Fte" : "other3Fte",
                              e.target.value ? parseFloat(e.target.value) : null
                            )
                          }
                          className="w-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </QuestionBlock>

          {/* Q6 */}
          <QuestionBlock
            num={6}
            title="Considering your hospital's overall inpatient antibacterial use (all antibacterial agents)"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-2">If you have your most recent SAAR value:</p>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="Enter SAAR value"
                  value={formData.saarValue ?? ""}
                  onChange={(e) => {
                    updateField(
                      "saarValue",
                      e.target.value ? parseFloat(e.target.value) : null
                    )
                    if (e.target.value) updateField("saarCategory", null)
                  }}
                  className="w-40"
                />
              </div>
              <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                <p className="text-xs text-slate-500 mb-2">Or select from dropdown:</p>
                <Select
                  value={formData.saarCategory ?? ""}
                  onValueChange={(v) => {
                    updateField("saarCategory", v || null)
                    if (v) updateField("saarValue", null)
                  }}
                >
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {SAAR_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </QuestionBlock>

          {/* Q7 */}
          <QuestionBlock
            num={7}
            title="In the past two years, has your program demonstrated effectiveness in any of the following areas? (Select all that apply)"
          >
            <div className="space-y-2">
              {EFFECTIVENESS_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer"
                >
                  <Checkbox
                    id={`eff-${opt.value}`}
                    checked={effectivenessSelections.includes(opt.value)}
                    onCheckedChange={(checked) =>
                      handleEffectivenessChange(opt.value, !!checked)
                    }
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{opt.label}</span>
                </label>
              ))}
              {effectivenessSelections.includes("other") && (
                <div className="mt-3 ml-1">
                  <Input
                    type="text"
                    placeholder="Please specify..."
                    value={formData.effectivenessOther ?? ""}
                    onChange={(e) =>
                      updateField("effectivenessOther", e.target.value)
                    }
                    className="w-full max-w-md"
                  />
                </div>
              )}
            </div>
          </QuestionBlock>

          {saveMessage && (
            <div
              className={`p-4 rounded-lg ${
                saveMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
              }`}
            >
              {saveMessage.text}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
            >
              {isSaving ? "Saving..." : "Save Survey Responses"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
