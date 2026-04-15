CREATE OR REPLACE FUNCTION public.create_company_for_current_user(
  _name text,
  _cnpj text DEFAULT NULL,
  _cpf text DEFAULT NULL,
  _phone text DEFAULT NULL,
  _email text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _existing_company_id uuid;
  _company_id uuid;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  SELECT company_id
  INTO _existing_company_id
  FROM public.profiles
  WHERE user_id = _user_id
  LIMIT 1;

  IF _existing_company_id IS NOT NULL THEN
    RETURN _existing_company_id;
  END IF;

  INSERT INTO public.companies (name, cnpj, cpf, phone, email)
  VALUES (
    NULLIF(trim(_name), ''),
    NULLIF(trim(_cnpj), ''),
    NULLIF(trim(_cpf), ''),
    NULLIF(trim(_phone), ''),
    NULLIF(trim(_email), '')
  )
  RETURNING id INTO _company_id;

  UPDATE public.profiles
  SET company_id = _company_id,
      updated_at = now()
  WHERE user_id = _user_id;

  INSERT INTO public.user_roles (user_id, company_id, role)
  VALUES (_user_id, _company_id, 'admin')
  ON CONFLICT DO NOTHING;

  INSERT INTO public.subscriptions (company_id)
  VALUES (_company_id)
  ON CONFLICT (company_id) DO NOTHING;

  RETURN _company_id;
END;
$$;