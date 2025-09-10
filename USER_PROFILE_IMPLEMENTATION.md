# User Profile Implementation Guide

## 🎯 **Overview**

This implementation provides a comprehensive user profile management system for SPARC (Stewardship Personnel Required for ASPs Resource Calculator) that captures essential professional and personal information relevant to antimicrobial stewardship work.

## 📋 **User Details Captured**

### **Personal Information**
- Full Name
- Phone Number
- Professional Title (Physician, Pharmacist, Nurse, etc.)

### **Professional Information**
- Institution/Organization
- Department/Unit
- Specialty (Infectious Diseases, Pharmacy, Microbiology, etc.)
- Years of Experience
- License Number (optional)

### **SPARC-Specific Information**
- Work Location (Hospital, Clinic, Long-term Care, etc.)
- Stewardship Role (Program Director, Pharmacist, Physician, etc.)
- Certification Status (optional)
- Time Zone (optional)
- Manager/Supervisor (optional)
- Team/Group Assignment (optional)
- Additional Notes (optional)

## 🛠 **Implementation Components**

### **1. UserProfileForm Component**
- **Location:** `src/app/components/UserProfileForm.tsx`
- **Features:**
  - Multi-step form (3 steps)
  - Progress indicator
  - Comprehensive validation
  - Professional dropdowns for consistency
  - Responsive design

### **2. ProfileCompletionPrompt Component**
- **Location:** `src/app/components/ProfileCompletionPrompt.tsx`
- **Features:**
  - Checks profile completion status
  - Shows missing fields
  - Allows users to complete profile or skip
  - Integrates with dashboard

### **3. Profile Page**
- **Location:** `src/app/profile/page.tsx`
- **Features:**
  - Full profile editing interface
  - Pre-populated with existing data
  - Server-side authentication check

### **4. Server Actions**
- **Location:** `src/lib/actions/user-profile.ts`
- **Functions:**
  - `updateUserProfile()` - Update user profile data
  - `getUserProfile()` - Retrieve user profile
  - `checkProfileCompletion()` - Check if profile is complete

## 🗄️ **Database Schema Updates**

### **New Columns Added to `profiles` Table:**
```sql
phone_number TEXT
professional_title TEXT
specialty TEXT
years_of_experience TEXT
license_number TEXT
work_location TEXT
stewardship_role TEXT
certification_status TEXT
time_zone TEXT
manager TEXT
team TEXT
notes TEXT
```

### **Constraints Added:**
- Professional title validation
- Specialty validation
- Stewardship role validation
- Work location validation
- Years of experience validation

## 🚀 **Setup Instructions**

### **1. Database Migration**
Run the database migration script:
```sql
-- Execute: database/update-profiles-schema.sql
```

### **2. Application Features**
- Profile completion prompt appears on dashboard for incomplete profiles
- Profile link added to header navigation
- Multi-step onboarding flow for new users
- Comprehensive profile editing page

## 🎨 **User Experience Flow**

### **New User Journey:**
1. **Sign Up** → Basic email/password
2. **First Login** → Profile completion prompt appears
3. **Complete Profile** → 3-step guided form
4. **Dashboard Access** → Full application features

### **Existing User Journey:**
1. **Login** → Profile completion check
2. **Missing Info** → Prompt to complete profile
3. **Profile Management** → Access via header link

## 🔧 **Technical Features**

### **Validation:**
- Required field validation
- Professional title/specialty constraints
- Phone number format validation
- Experience level validation

### **Security:**
- Server-side authentication checks
- Row Level Security (RLS) compliance
- Input sanitization and validation

### **Performance:**
- Server actions for data operations
- Optimized database queries
- Client-side form state management

## 📊 **Admin Benefits**

### **Enhanced User Analytics:**
- Professional demographics
- Institution distribution
- Role-based activity tracking
- Experience level insights

### **Improved User Management:**
- Complete user profiles
- Professional context
- Team/organization structure
- Contact information

## 🎯 **Best Practices Implemented**

1. **Progressive Disclosure** - Information collected in logical steps
2. **Optional Fields** - Non-essential fields are optional
3. **Professional Context** - SPARC-specific fields for relevant data
4. **User Control** - Users can skip or complete later
5. **Data Validation** - Comprehensive validation at multiple levels
6. **Responsive Design** - Works on all device sizes

## 🔄 **Future Enhancements**

### **Potential Additions:**
- Profile photo upload
- Professional certifications tracking
- Team collaboration features
- Institution-specific customizations
- Advanced analytics and reporting
- Integration with external systems

## 📝 **Usage Examples**

### **For Administrators:**
- View complete user profiles
- Track professional demographics
- Manage team structures
- Generate institutional reports

### **For Users:**
- Complete professional profile
- Update information as needed
- Access profile from dashboard
- Maintain professional context

This implementation provides a solid foundation for user profile management while maintaining the professional focus required for antimicrobial stewardship applications.
