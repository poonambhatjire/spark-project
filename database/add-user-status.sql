-- Add user status management to profiles table
-- Run this in your Supabase SQL Editor

-- Add is_active column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Add index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

-- Update existing users to be active by default
UPDATE profiles 
SET is_active = TRUE 
WHERE is_active IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN profiles.is_active IS 'Whether the user account is active (can sign in) or inactive (disabled)';
