-- Run this on your Supabase SQL Editor to create the 'notes' table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: Depending on your setup, you might want to enable Row Level Security (RLS)
-- and add a policy, OR you can leave it off for a simplified MVP.
-- If you want anyone to insert, uncomment the following:

-- ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations for now" ON public.notes FOR ALL USING (true);

-- ===== Placement Questions Table =====
CREATE TABLE IF NOT EXISTS public.placement_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    company TEXT,              -- nullable: only used when category = 'Company Wise'
    user_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Enable RLS if needed
-- ALTER TABLE public.placement_questions ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations for placement" ON public.placement_questions FOR ALL USING (true);
