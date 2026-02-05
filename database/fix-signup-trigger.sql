-- =============================================
-- FIX SIGNUP TRIGGER - Add institution_id
-- Updates handle_new_user() function to include institution_id
-- =============================================

-- Update the handle_new_user function to include institution_id
-- Default to "Other" institution for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  other_institution_id UUID;
BEGIN
  -- Get the "Other" institution ID
  SELECT id INTO other_institution_id
  FROM public.institutions
  WHERE name = 'Other'
  LIMIT 1;
  
  -- If "Other" doesn't exist, this will fail - but it should exist
  IF other_institution_id IS NULL THEN
    RAISE EXCEPTION 'Default institution "Other" not found. Please create it first.';
  END IF;
  
  -- Insert profile with institution_id set to "Other"
  INSERT INTO public.profiles (id, email, name, role, is_active, institution_id, created_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'user',
    true,
    other_institution_id,
    now()
  );
  
  RETURN new;
END;
$$;

-- Add comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates a profile for new users with default institution_id set to "Other"';
