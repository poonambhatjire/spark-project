# Sample Data Generation for SPARC Calculator

## 🎯 **Overview**

This directory contains scripts to create realistic sample data for testing the SPARC Calculator application. The sample data includes 20 diverse healthcare professionals with varied activities, roles, and realistic usage patterns.

## 📁 **Files**

- **`create-sample-data-updated.sql`** - Creates 20 sample users with realistic activities (latest version)
- **`complete-cleanup.sql`** - Removes all sample data and resets RLS policies
- **`schema-analysis-results.json`** - Database schema analysis results for reference
- **`setup-instructions.md`** - Database setup instructions
- **`SAMPLE_DATA_README.md`** - This documentation file

## 🚀 **How to Use**

### **Step 1: Create Sample Data**

1. **Access your Supabase database:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Or use your preferred PostgreSQL client

2. **Run the creation script:**
   ```sql
   -- Copy and paste the contents of create-sample-data-updated.sql
   -- Execute the script
   ```

3. **Verify the data was created:**
   - The script includes verification queries at the end
   - You should see counts for users, time entries, contact submissions, and admin activities

### **Step 2: Test Your Application**

With the sample data in place, you can now test:

- **Admin Panel Features:**
  - User management and role assignment
  - Activity analytics and reporting
  - Bulk operations and exports
  - System settings and configuration

- **User Experience:**
  - Login with different user types
  - View realistic activity data
  - Test export functionality
  - Experience the full application flow

### **Step 3: Clean Up Sample Data**

When you're done testing:

1. **Run the cleanup script:**
   ```sql
   -- Copy and paste the contents of complete-cleanup.sql
   -- Execute the script
   ```

2. **Verify cleanup:**
   - The script includes verification queries
   - All counts should be 0

## 👥 **Sample Users Created**

### **User Roles:**
- **3 Admins** - Dr. Sarah Johnson (Program Director), Dr. Michael Chen (Pharmacist), Jennifer Martinez (Nurse)
- **17 Regular Users** - Mix of physicians, pharmacists, nurses, and other healthcare professionals

### **User Diversity:**
- **Professional Titles:** Physicians, Pharmacists, Nurses, Microbiologists, Epidemiologists
- **Specialties:** Infectious Diseases, Clinical Pharmacy, Critical Care, Emergency Medicine, Surgery, Pediatrics
- **Experience Levels:** 2-5 years, 6-10 years, 11-15 years, 16-20 years, 20+ years
- **Institutions:** Metro General Hospital, City Medical Center, Regional Health System
- **Departments:** Various healthcare departments and units

### **Activity Patterns:**
- **Time Range:** Last 90 days of realistic activity
- **Task Types:** All 15 available activity categories
- **Time Distribution:** Realistic minutes per activity (10-135 minutes)
- **Comments:** Professional, realistic comments for each entry
- **Work Patterns:** Weekday focus with some weekend work

## 🔍 **Identifying Sample Data**

All sample data is easily identifiable by:
- **Email addresses** ending with `@sample-test.com`
- **Notes field** containing "Sample" keyword
- **Consistent naming patterns** in user profiles

## ⚠️ **Important Notes**

### **Before Creating Sample Data:**
- Make sure your database schema is up to date
- Run any pending migrations first
- Consider backing up your current data

### **After Testing:**
- Always clean up sample data before going to production
- Remove sample data before real users start using the system
- The cleanup script is safe to run multiple times

### **Security Considerations:**
- Sample data includes realistic but fake personal information
- All phone numbers, license numbers, and other details are fictional
- This data should never be used in production environments

## 🛠 **Troubleshooting**

### **Common Issues:**

1. **"Column does not exist" errors:**
   - Make sure you've run the profile schema updates
   - Check that all required columns exist in the profiles table

2. **"Permission denied" errors:**
   - Ensure you have the necessary database permissions
   - Check that RLS policies allow the operations

3. **"Duplicate key" errors:**
   - Sample data may already exist
   - Run the cleanup script first, then recreate

### **Getting Help:**
- Check the Supabase logs for detailed error messages
- Verify your database schema matches the expected structure
- Ensure all required tables and columns exist

## 📊 **Expected Results**

After running the creation script, you should see:

- **20 sample users** with complete profiles
- **500-1000+ time entries** across all users
- **3 sample contact submissions**
- **15-30 admin activities**
- **Realistic activity distribution** across all task types
- **Professional, diverse user base** representing real healthcare teams

This sample data will provide a comprehensive testing environment for all features of the SPARC Calculator application.
