import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Sparkles, Image as ImageIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { fmtDate } from "@/lib/orders";

const SettingsPage = () => {
  const { profile } = useAuth();
  const qc = useQueryClient();

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("*").eq("id", profile!.company_id!).maybeSingle();
      return data;
    },
    enabled: !!profile?.company_id,
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription", profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("subscriptions").select("*").eq("company_id", profile!.company_id!).maybeSingle();
      return data;
    },
    enabled: !!profile?.company_id,
  });

  const [form, setForm] = useState<any>({});
  useEffect(() => { if (company) setForm(company); }, [company]);

  const update = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("companies").update({
        name: form.name,
        cnpj: form.cnpj || null,
        cpf: form.cpf || null,
        phone: form.phone || null,
        email: form.email || null,
        address_street: form.address_street || null,
        address_number: form.address_number || null,
        address_neighborhood: form.address_neighborhood || null,
        address_city: form.address_city || null,
        address_state: form.address_state || null,
        address_zip: form.address_zip || null,
        responsibility_term: form.responsibility_term || null,
        logo_url: form.logo_url || null,
      }).eq("id", profile!.company_id!);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Salvo!"); qc.invalidateQueries({ queryKey: ["company"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const uploadLogo = useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split(".").pop();
      const path = `logos/${profile!.company_id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("os-photos").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("os-photos").getPublicUrl(path);
      update("logo_url", data.publicUrl);
      return data.publicUrl;
    },
    onSuccess: () => toast.success("Logo enviado. Clique em Salvar."),
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="max-w-3xl space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Card className="os-shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Plano Atual</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-4 gap-4 text-sm">
          <div><span className="text-muted-foreground block">Plano</span><span className="font-bold capitalize">{subscription?.plan ?? "—"}</span></div>
          <div><span className="text-muted-foreground block">OS / mês</span><span className="font-bold">{subscription?.os_limit_monthly}</span></div>
          <div><span className="text-muted-foreground block">Vendas / mês</span><span className="font-bold">{subscription?.sales_limit_monthly}</span></div>
          <div><span className="text-muted-foreground block">Expira</span><span className="font-bold">{fmtDate(subscription?.expires_at)}</span></div>
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Dados da Empresa</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
              {form.logo_url ? <img src={form.logo_url} alt="logo" className="w-full h-full object-cover" /> : <ImageIcon className="h-8 w-8 text-muted-foreground" />}
            </div>
            <Label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted">
              Trocar logo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo.mutate(e.target.files[0])} />
            </Label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome da Empresa *</Label><Input value={form.name ?? ""} onChange={(e) => update("name", e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email ?? ""} onChange={(e) => update("email", e.target.value)} /></div>
            <div className="space-y-2"><Label>CNPJ</Label><Input value={form.cnpj ?? ""} onChange={(e) => update("cnpj", e.target.value)} /></div>
            <div className="space-y-2"><Label>CPF</Label><Input value={form.cpf ?? ""} onChange={(e) => update("cpf", e.target.value)} /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input value={form.phone ?? ""} onChange={(e) => update("phone", e.target.value)} /></div>
            <div className="space-y-2"><Label>CEP</Label><Input value={form.address_zip ?? ""} onChange={(e) => update("address_zip", e.target.value)} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Rua</Label><Input value={form.address_street ?? ""} onChange={(e) => update("address_street", e.target.value)} /></div>
            <div className="space-y-2"><Label>Número</Label><Input value={form.address_number ?? ""} onChange={(e) => update("address_number", e.target.value)} /></div>
            <div className="space-y-2"><Label>Bairro</Label><Input value={form.address_neighborhood ?? ""} onChange={(e) => update("address_neighborhood", e.target.value)} /></div>
            <div className="space-y-2"><Label>Cidade</Label><Input value={form.address_city ?? ""} onChange={(e) => update("address_city", e.target.value)} /></div>
            <div className="space-y-2"><Label>Estado</Label><Input value={form.address_state ?? ""} onChange={(e) => update("address_state", e.target.value)} /></div>
          </div>

          <div className="space-y-2">
            <Label>Termo de Responsabilidade</Label>
            <Textarea rows={4} value={form.responsibility_term ?? ""} onChange={(e) => update("responsibility_term", e.target.value)} placeholder="Texto exibido nas OS impressas..." />
          </div>
        </CardContent>
      </Card>

      <Button className="os-gradient-primary border-0" onClick={() => save.mutate()} disabled={save.isPending}>
        {save.isPending ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
};

export default SettingsPage;
