
-- ============================================================
-- UTILITY: updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================
-- 1. COMPANIES
-- ============================================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  address_street TEXT,
  address_number TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  responsibility_term TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. PROFILES (linked to auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. USER ROLES (separate table as required)
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'technician', 'attendant', 'viewer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _company_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND company_id = _company_id AND role = _role
  );
$$;

-- Helper: get user's company_id
CREATE OR REPLACE FUNCTION public.get_user_company_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT company_id FROM public.profiles WHERE user_id = _user_id LIMIT 1;
$$;

-- ============================================================
-- 4. SUBSCRIPTIONS (freemium control)
-- ============================================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  os_limit_monthly INT NOT NULL DEFAULT 15,
  sales_limit_monthly INT NOT NULL DEFAULT 10,
  checklist_limit INT NOT NULL DEFAULT 3,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. CLIENTS
-- ============================================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  identifier TEXT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_clients_company ON public.clients(company_id);

CREATE TABLE public.client_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  label TEXT DEFAULT 'Principal',
  street TEXT,
  number TEXT,
  complement TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_addresses ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.client_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.client_contracts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. SERVICES
-- ============================================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'serviço',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_services_company ON public.services(company_id);

CREATE TABLE public.service_price_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_price_table ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. PRODUCTS
-- ============================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  max_discount NUMERIC(5,2) DEFAULT 0,
  charge_on_os BOOLEAN NOT NULL DEFAULT true,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_products_company ON public.products(company_id);

-- ============================================================
-- 8. CHECKLISTS
-- ============================================================
CREATE TABLE public.checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_checklists_updated_at BEFORE UPDATE ON public.checklists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 9. ORDERS (OS / Orçamentos)
-- ============================================================
CREATE TYPE public.order_type AS ENUM ('os', 'quote');
CREATE TYPE public.order_status AS ENUM ('quote', 'authorized', 'in_progress', 'completed', 'lost');

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number SERIAL,
  type public.order_type NOT NULL DEFAULT 'os',
  status public.order_status NOT NULL DEFAULT 'quote',
  title TEXT,
  object_description TEXT,
  public_notes TEXT,
  internal_notes TEXT,
  service_date TIMESTAMPTZ,
  delivery_date TIMESTAMPTZ,
  repeat_days INT,
  discount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  client_address_id UUID REFERENCES public.client_addresses(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_orders_company ON public.orders(company_id);
CREATE INDEX idx_orders_client ON public.orders(client_id);
CREATE INDEX idx_orders_status ON public.orders(status);

CREATE TABLE public.order_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  subtotal NUMERIC(12,2) GENERATED ALWAYS AS (price * quantity) STORED,
  checklist_id UUID REFERENCES public.checklists(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_services ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  discount_pct NUMERIC(5,2) DEFAULT 0,
  subtotal NUMERIC(12,2) GENERATED ALWAYS AS (price * quantity * (1 - COALESCE(discount_pct, 0) / 100)) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_products ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_service_id UUID REFERENCES public.order_services(id) ON DELETE CASCADE,
  checklist_id UUID REFERENCES public.checklists(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_checklists ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_checklist_id UUID NOT NULL REFERENCES public.order_checklists(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  stage TEXT DEFAULT 'during',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_photos ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_comments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  receipt_url TEXT,
  notes TEXT,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_payments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  signature_data TEXT NOT NULL,
  signer_name TEXT,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_signatures ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  latitude NUMERIC(10,7) NOT NULL,
  longitude NUMERIC(10,7) NOT NULL,
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.order_locations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 10. SERVICE REPEATS
-- ============================================================
CREATE TABLE public.service_repeats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  next_contact_date DATE NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_repeats ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 11. QUICK SALES (Caixa Rápido)
-- ============================================================
CREATE TABLE public.quick_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  sold_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  payment_method TEXT NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  notes TEXT,
  sold_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quick_sales ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.quick_sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quick_sale_id UUID NOT NULL REFERENCES public.quick_sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  subtotal NUMERIC(12,2) GENERATED ALWAYS AS (price * quantity) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quick_sale_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Companies
CREATE POLICY "Users see own company" ON public.companies
  FOR SELECT USING (id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Users update own company" ON public.companies
  FOR UPDATE USING (id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Anyone can create a company" ON public.companies
  FOR INSERT WITH CHECK (true);

-- Profiles
CREATE POLICY "Users see own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- User roles
CREATE POLICY "Users see roles in own company" ON public.user_roles
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Admins insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));

-- Subscriptions
CREATE POLICY "Users see own subscription" ON public.subscriptions
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Anyone can create subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (true);

-- Clients
CREATE POLICY "Company sees own clients" ON public.clients
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company inserts clients" ON public.clients
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company updates clients" ON public.clients
  FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company deletes clients" ON public.clients
  FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- Client addresses
CREATE POLICY "Company sees client addresses" ON public.client_addresses
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts client addresses" ON public.client_addresses
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company updates client addresses" ON public.client_addresses
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes client addresses" ON public.client_addresses
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.company_id = public.get_user_company_id(auth.uid())));

-- Client contracts
CREATE POLICY "Company sees client contracts" ON public.client_contracts
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts client contracts" ON public.client_contracts
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company updates client contracts" ON public.client_contracts
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes client contracts" ON public.client_contracts
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.clients c WHERE c.id = client_id AND c.company_id = public.get_user_company_id(auth.uid())));

-- Services
CREATE POLICY "Company sees own services" ON public.services
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company inserts services" ON public.services
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company updates services" ON public.services
  FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company deletes services" ON public.services
  FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- Service price table
CREATE POLICY "Company sees service prices" ON public.service_price_table
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.services s WHERE s.id = service_id AND s.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts service prices" ON public.service_price_table
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.services s WHERE s.id = service_id AND s.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company updates service prices" ON public.service_price_table
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.services s WHERE s.id = service_id AND s.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes service prices" ON public.service_price_table
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.services s WHERE s.id = service_id AND s.company_id = public.get_user_company_id(auth.uid())));

-- Products
CREATE POLICY "Company sees own products" ON public.products
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company inserts products" ON public.products
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company updates products" ON public.products
  FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company deletes products" ON public.products
  FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- Checklists
CREATE POLICY "Company sees own checklists" ON public.checklists
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company inserts checklists" ON public.checklists
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company updates checklists" ON public.checklists
  FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company deletes checklists" ON public.checklists
  FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- Checklist items
CREATE POLICY "Company sees checklist items" ON public.checklist_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.checklists cl WHERE cl.id = checklist_id AND cl.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts checklist items" ON public.checklist_items
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.checklists cl WHERE cl.id = checklist_id AND cl.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company updates checklist items" ON public.checklist_items
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.checklists cl WHERE cl.id = checklist_id AND cl.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes checklist items" ON public.checklist_items
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.checklists cl WHERE cl.id = checklist_id AND cl.company_id = public.get_user_company_id(auth.uid())));

-- Orders
CREATE POLICY "Company sees own orders" ON public.orders
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company inserts orders" ON public.orders
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company updates orders" ON public.orders
  FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company deletes orders" ON public.orders
  FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- Order services
CREATE POLICY "Company sees order services" ON public.order_services
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order services" ON public.order_services
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company updates order services" ON public.order_services
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes order services" ON public.order_services
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Order products
CREATE POLICY "Company sees order products" ON public.order_products
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order products" ON public.order_products
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company updates order products" ON public.order_products
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes order products" ON public.order_products
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Order checklists
CREATE POLICY "Company sees order checklists" ON public.order_checklists
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order checklists" ON public.order_checklists
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company updates order checklists" ON public.order_checklists
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes order checklists" ON public.order_checklists
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Order checklist items
CREATE POLICY "Company sees order checklist items" ON public.order_checklist_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.order_checklists oc JOIN public.orders o ON o.id = oc.order_id WHERE oc.id = order_checklist_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order checklist items" ON public.order_checklist_items
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.order_checklists oc JOIN public.orders o ON o.id = oc.order_id WHERE oc.id = order_checklist_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company updates order checklist items" ON public.order_checklist_items
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.order_checklists oc JOIN public.orders o ON o.id = oc.order_id WHERE oc.id = order_checklist_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes order checklist items" ON public.order_checklist_items
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.order_checklists oc JOIN public.orders o ON o.id = oc.order_id WHERE oc.id = order_checklist_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Order photos
CREATE POLICY "Company sees order photos" ON public.order_photos
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order photos" ON public.order_photos
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes order photos" ON public.order_photos
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Order comments
CREATE POLICY "Company sees order comments" ON public.order_comments
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order comments" ON public.order_comments
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes order comments" ON public.order_comments
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Order payments
CREATE POLICY "Company sees order payments" ON public.order_payments
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order payments" ON public.order_payments
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company deletes order payments" ON public.order_payments
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Order signatures
CREATE POLICY "Company sees order signatures" ON public.order_signatures
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order signatures" ON public.order_signatures
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Order locations
CREATE POLICY "Company sees order locations" ON public.order_locations
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts order locations" ON public.order_locations
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.company_id = public.get_user_company_id(auth.uid())));

-- Service repeats
CREATE POLICY "Company sees service repeats" ON public.service_repeats
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company inserts service repeats" ON public.service_repeats
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company updates service repeats" ON public.service_repeats
  FOR UPDATE USING (company_id = public.get_user_company_id(auth.uid()));

-- Quick sales
CREATE POLICY "Company sees quick sales" ON public.quick_sales
  FOR SELECT USING (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company inserts quick sales" ON public.quick_sales
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id(auth.uid()));
CREATE POLICY "Company deletes quick sales" ON public.quick_sales
  FOR DELETE USING (company_id = public.get_user_company_id(auth.uid()));

-- Quick sale items
CREATE POLICY "Company sees quick sale items" ON public.quick_sale_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.quick_sales qs WHERE qs.id = quick_sale_id AND qs.company_id = public.get_user_company_id(auth.uid())));
CREATE POLICY "Company inserts quick sale items" ON public.quick_sale_items
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.quick_sales qs WHERE qs.id = quick_sale_id AND qs.company_id = public.get_user_company_id(auth.uid())));

-- Storage bucket for OS photos
INSERT INTO storage.buckets (id, name, public) VALUES ('os-photos', 'os-photos', true);
CREATE POLICY "Authenticated users can upload OS photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'os-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can view OS photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'os-photos');
