// Type definitions for content validation
export type KeywordType = 
  | "Antimicrobial Stewardship Programs (ASPs)"
  | "Staffing Requirements"
  | "Evidence-Based Recommendations"
  | "Time-in-Motion Study Data"
  | "Tailored by Hospital Type & Size"
  | "Full-Time Equivalents (FTEs)"
  | "Implementation Science"
  | "Web-Based Tool"

export type AimType = 
  | "Quantify Activities"
  | "Develop Calculator"
  | "Support Implementation"

export type ImpactType = 
  | "Antimicrobial Use Assessment"
  | "Drug Resistance Monitoring"
  | "Patient Outcome Analysis"

// Content exports with type safety
export const title = "SPARC — Stewardship Personnel required for Antimicrobial Stewardship Programs Resource Calculator"

export const subtitle = "Antimicrobial Stewardship Resource Calculator"

export const keywords: readonly KeywordType[] = [
  "Antimicrobial Stewardship Programs (ASPs)",
  "Staffing Requirements",
  "Evidence-Based Recommendations",
  "Time-in-Motion Study Data",
  "Tailored by Hospital Type & Size",
  "Full-Time Equivalents (FTEs)",
  "Implementation Science",
  "Web-Based Tool"
] satisfies readonly KeywordType[]

export const aims: readonly AimType[] = [
  "Quantify Activities",
  "Develop Calculator",
  "Support Implementation"
] satisfies readonly AimType[]

export const impact: readonly ImpactType[] = [
  "Antimicrobial Use Assessment",
  "Drug Resistance Monitoring",
  "Patient Outcome Analysis"
] satisfies readonly ImpactType[]

export const accessHref = "/dashboard"

export const supportEmail = "your-email@example.com"

export const footerNote = "No data stored or transmitted by this page."
