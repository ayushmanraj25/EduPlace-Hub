
GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;

GRANT ALL ON TABLE public.notes TO anon;
GRANT ALL ON TABLE public.notes TO authenticated;

GRANT ALL ON TABLE public.placement_questions TO anon;
GRANT ALL ON TABLE public.placement_questions TO authenticated;

GRANT ALL ON TABLE public.company_questions TO anon;
GRANT ALL ON TABLE public.company_questions TO authenticated;

-- Step 2: Disable RLS so no row-level policies block access
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_questions DISABLE ROW LEVEL SECURITY;

-- Step 3: Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ✅ After running this, "permission denied" will be gone forever.
