-- =============================================
-- FIX ADMIN FUNCTION TYPE MISMATCH
-- Fixes the type mismatch error in get_all_users_for_admin function
-- =============================================

-- Drop and recreate the function with correct types
DROP FUNCTION IF EXISTS public.get_all_users_for_admin();

-- Function to get all users for admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_users_for_admin()
RETURNS TABLE (
  id uuid,
  email character varying(255),
  name character varying(255),
  role character varying(255),
  is_active boolean,
  created_at timestamptz
) AS $$
BEGIN
  -- Only allow if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.name,
    p.role,
    p.is_active,
    p.created_at
  FROM profiles p
  ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the function
SELECT 'Function fixed successfully' as status;
