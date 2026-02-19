# Database Analysis for Business Users

## Purpose

This document helps business stakeholders understand what data the SPARC Calculator captures and whether it supports the analyses needed for ASP (Antimicrobial Stewardship Program) staffing decisions. The goal is to ensure the database contains sufficient data for evidence-based staffing guidance.

---

## 1. Data We Currently Capture

### 1.1 Time Entries (`time_entries`)

| Field | Description | Use in Analysis |
|-------|-------------|-----------------|
| **task** | Activity type (e.g., Patient Care - Prospective Audit & Feedback) | Activity mix, workload distribution |
| **minutes** | Time spent (1–480) | FTE, capacity, benchmarking |
| **occurred_on** | Date and time | Trends, day-of-week patterns, hourly distribution |
| **patient_count** | # of patients (Patient Care tasks only) | Caseload, productivity (patients/hour) |
| **is_typical_day** | Whether the day reflects normal workload | FTE weighting, outlier handling |
| **comment** | Free text notes | Qualitative context, edge cases |
| **user_id** | Who logged the entry | Per-user and aggregate reporting |

**Activity Categories:**
- Patient Care: Prospective Audit & Feedback, Authorization of Restricted Antimicrobials, Curbside ASP Questions, ASP Rounds, Other
- Administrative: Guidelines/EHR, Committee Work, QI projects/research, Emails, Other
- Tracking: Antimicrobial Use, Antimicrobial Resistance, Antibiotic Appropriateness, Intervention Acceptance, Other
- Reporting: Sharing data with prescribers/decision makers, Other
- Education: Providing Education, Receiving Education, Other

---

### 1.2 User Profiles (`profiles`)

| Field | Description | Use in Analysis |
|-------|-------------|-----------------|
| **name** | Full name | Reporting, identification |
| **email** | Email address | Contact, de-duplication |
| **title** | Professional role (e.g., Pharmacist, ID Physician) | Role-based staffing, workload by role |
| **experience_level** | Years of experience (0–1, 2–5, etc.) | Experience–workload analysis |
| **institution** | Organization/hospital | Cross-institution benchmarking |
| **institution_id** | Reference to institutions table | Consistent aggregation |
| **timezone** | User time zone | Correct time interpretation |
| **role** | user/admin/super_admin | Access control (not analytics) |

---

### 1.3 Burnout Survey (`burnout_survey_responses`)

| Field | Description | Use in Analysis |
|-------|-------------|-----------------|
| **question_number** | OLBI question 1–12 | Exhaustion / disengagement scores |
| **response_value** | 1–4 (Strongly Agree to Strongly Disagree) | Burnout severity |
| **user_id** | Respondent | Link to workload and profiles |

**Derived:** Exhaustion score, disengagement score, overall burnout level.

---

### 1.4 Supporting Tables

| Table | Purpose |
|-------|---------|
| **institutions** | Standard list of institutions for benchmarking |
| **activities** | Normalized activity types (maps to `task`) |
| **activity_categories** | Groups activities (Patient Care, Administrative, etc.) |
| **admin_activities** | Audit log of admin actions |
| **contact_submissions** | Contact form leads |
| **telemetry_events** | App usage (e.g., page views) |
