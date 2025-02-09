-- Create work_experiences table
CREATE TABLE public.work_experiences (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT work_experiences_pkey PRIMARY KEY (id)
);

-- Create education table
CREATE TABLE public.education (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    school TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT,
    graduation_date DATE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT education_pkey PRIMARY KEY (id)
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    technologies TEXT,
    link TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT projects_pkey PRIMARY KEY (id)
);

-- Create skills table
CREATE TABLE public.skills (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT skills_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_skill UNIQUE (user_id, name)
);

-- Add RLS policies
ALTER TABLE public.work_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Work experiences policies
CREATE POLICY "Users can view their own work experiences"
ON public.work_experiences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own work experiences"
ON public.work_experiences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work experiences"
ON public.work_experiences FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work experiences"
ON public.work_experiences FOR DELETE
USING (auth.uid() = user_id);

-- Education policies
CREATE POLICY "Users can view their own education"
ON public.education FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own education"
ON public.education FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own education"
ON public.education FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own education"
ON public.education FOR DELETE
USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY "Users can view their own projects"
ON public.projects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
ON public.projects FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
ON public.projects FOR DELETE
USING (auth.uid() = user_id);

-- Skills policies
CREATE POLICY "Users can view their own skills"
ON public.skills FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills"
ON public.skills FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills"
ON public.skills FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills"
ON public.skills FOR DELETE
USING (auth.uid() = user_id);
