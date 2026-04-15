import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Building2 } from "lucide-react";

export default function CompanySetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    cnpj: "",
    cpf: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { data: company, error: companyError } = await (supabase
      .from("companies") as any)
      .insert({
        name: form.name,
        cnpj: form.cnpj || null,
        cpf: form.cpf || null,
        phone: form.phone || null,
        email: form.email || null,
      })
      .select("id")
      .single();

    if (companyError || !company) {
      toast.error("Erro ao criar empresa: " + (companyError?.message || "Erro desconhecido"));
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ company_id: company.id })
      .eq("user_id", user.id);

    if (profileError) {
      toast.error("Erro ao vincular empresa: " + profileError.message);
      setLoading(false);
      return;
    }

    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, company_id: company.id, role: "admin" });

    if (roleError) {
      toast.error("Erro ao criar perfil admin: " + roleError.message);
      setLoading(false);
      return;
    }

    const { error: subError } = await supabase
      .from("subscriptions")
      .insert({ company_id: company.id });

    if (subError) {
      console.error("Subscription error:", subError);
    }

    toast.success("Empresa cadastrada com sucesso!");
    setLoading(false);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl os-gradient-primary flex items-center justify-center mb-3">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-display">Cadastrar Empresa</CardTitle>
          <CardDescription>Configure sua empresa para começar a usar o OS10</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da empresa *</Label>
              <Input id="name" placeholder="Ex: Oficina 2 Irmãos" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" placeholder="00.000.000/0001-00" value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email da empresa</Label>
                <Input id="email" type="email" placeholder="contato@empresa.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>
            <Button type="submit" className="w-full os-gradient-primary border-0" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Cadastrar e Começar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
