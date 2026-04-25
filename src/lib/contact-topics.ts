export const CONTACT_TOPICS = [
  { value: "general", label: "General question" },
  { value: "calculator", label: "Calculator / SPARC usage" },
  { value: "partnership", label: "Partnership or research" },
  { value: "technical", label: "Technical issue" },
  { value: "other", label: "Other" },
] as const

export function getContactTopicLabel(value: string): string {
  return CONTACT_TOPICS.find((t) => t.value === value)?.label ?? value
}
