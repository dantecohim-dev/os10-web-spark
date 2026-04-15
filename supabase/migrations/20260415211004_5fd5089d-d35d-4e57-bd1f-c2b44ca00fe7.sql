DROP POLICY IF EXISTS "Authenticated users can create a company" ON public.companies;

CREATE POLICY "Users can create company only before setup"
ON public.companies
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND p.company_id IS NULL
  )
);