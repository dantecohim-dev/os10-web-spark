
-- Add new columns to profiles
ALTER TABLE public.profiles ADD COLUMN phone text;
ALTER TABLE public.profiles ADD COLUMN business_area text;
ALTER TABLE public.profiles ADD COLUMN origin text;

-- Update the handle_new_user trigger to save new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, business_area, origin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'business_area',
    NEW.raw_user_meta_data->>'origin'
  );
  RETURN NEW;
END;
$$;
