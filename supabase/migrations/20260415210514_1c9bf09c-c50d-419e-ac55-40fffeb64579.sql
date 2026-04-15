
-- Add CPF column
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS cpf text;

-- Fix INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create a company" ON public.companies;
CREATE POLICY "Authenticated users can create a company"
ON public.companies FOR INSERT
TO authenticated
WITH CHECK (true);
