
-- Fix overly permissive INSERT on companies
DROP POLICY "Anyone can create a company" ON public.companies;
CREATE POLICY "Authenticated users can create a company" ON public.companies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Fix overly permissive INSERT on subscriptions
DROP POLICY "Anyone can create subscription" ON public.subscriptions;
CREATE POLICY "Authenticated users can create subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Fix public bucket listing - restrict to authenticated and scoped
DROP POLICY "Anyone can view OS photos" ON storage.objects;
CREATE POLICY "Authenticated users can view OS photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'os-photos' AND auth.role() = 'authenticated');
