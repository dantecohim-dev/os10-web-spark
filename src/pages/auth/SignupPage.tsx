import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const BUSINESS_AREAS = [
  "Mecânico de Automóveis – Autônomo",
  "Oficina Mecânica de Automóveis – Empresa",
  "Mecânico de Motocicletas – Autônomo",
  "Oficina de Motocicletas – Empresa",
  "Mecânico de Bicicletas – Autônomo",
  "Oficina de Bicicletas – Empresa",
  "Mecânico Geral – Autônomo",
  "Oficina Mecânica Geral – Empresa",
  "Funileiro – Autônomo",
  "Funilaria – Empresa",
  "Borracheiro – Autônomo",
  "Borracharia – Empresa",
  "Estética Automotiva – Autônomo",
  "Centro de Estética Automotiva – Empresa",
  "Instalador de Acessórios Automotivos – Autônomo",
  "Loja de Acessórios Automotivos – Empresa",
  "Eletricista – Autônomo",
  "Serviços Elétricos – Empresa",
  "Encanador – Autônomo",
  "Serviços Hidráulicos – Empresa",
  "Técnico em Ar-condicionado – Autônomo",
  "Empresa de Ar-condicionado – Empresa",
  "Assistência Técnica de Ar-condicionado – Empresa",
  "Técnico em Refrigeração – Autônomo",
  "Assistência Técnica de Refrigeração – Empresa",
  "Instalador de Energia Solar – Autônomo",
  "Empresa de Energia Solar – Empresa",
  "Técnico em Manutenção de Celulares – Autônomo",
  "Assistência Técnica de Celulares – Empresa",
  "Técnico em Manutenção de Computadores – Autônomo",
  "Assistência Técnica de Computadores – Empresa",
  "Técnico em Eletrodomésticos – Autônomo",
  "Assistência Técnica de Eletrodomésticos – Empresa",
  "Pedreiro – Autônomo",
  "Empresa de Construção – Empresa",
  "Pintor – Autônomo",
  "Empresa de Pintura – Empresa",
  "Instalador de Drywall – Autônomo",
  "Empresa de Drywall – Empresa",
  "Instalador de Pisos e Revestimentos – Autônomo",
  "Empresa de Pisos e Revestimentos – Empresa",
  "Marceneiro – Autônomo",
  "Marcenaria – Empresa",
  "Serralheiro – Autônomo",
  "Serralheria – Empresa",
  "Vidraceiro – Autônomo",
  "Vidraçaria – Empresa",
  "Instalador de Câmeras e Alarmes – Autônomo",
  "Empresa de Segurança Eletrônica – Empresa",
  "Técnico em Redes – Autônomo",
  "Empresa de Infraestrutura de TI – Empresa",
  "Profissional de Limpeza – Autônomo",
  "Empresa de Limpeza – Empresa",
  "Jardineiro – Autônomo",
  "Empresa de Jardinagem – Empresa",
  "Dedetizador – Autônomo",
  "Dedetizadora – Empresa",
  "Agrônomo – Autônomo",
  "Empresa de Consultoria Agronômica – Empresa",
  "Médico Veterinário – Autônomo",
  "Clínica Veterinária Rural – Empresa",
  "Aplicador de Defensivos Agrícolas – Autônomo",
  "Empresa de Pulverização Agrícola – Empresa",
  "Instalador de Sistemas de Irrigação – Autônomo",
  "Empresa de Irrigação – Empresa",
  "Mecânico de Máquinas Agrícolas – Autônomo",
  "Oficina de Máquinas Agrícolas – Empresa",
];

const ORIGINS = [
  "Google",
  "Instagram",
  "Pesquisa na loja de aplicativos",
  "Indicação",
  "Evento / Feira",
  "Outro",
];

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessArea, setBusinessArea] = useState("");
  const [customBusinessArea, setCustomBusinessArea] = useState("");
  const [origin, setOrigin] = useState("");
  const [customOrigin, setCustomOrigin] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!phone.trim()) {
      toast.error("WhatsApp é obrigatório");
      return;
    }

    if (!businessArea) {
      toast.error("Selecione sua área de atuação");
      return;
    }

    const finalBusinessArea = businessArea === "__other__" ? customBusinessArea.trim() : businessArea;
    const finalOrigin = origin === "Outro" ? customOrigin.trim() : origin;

    if (businessArea === "__other__" && !finalBusinessArea) {
      toast.error("Digite sua área de atuação");
      return;
    }

    if (origin === "Outro" && !finalOrigin) {
      toast.error("Digite como conheceu o OS10");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          business_area: finalBusinessArea,
          origin: finalOrigin || null,
        },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Conta criada! Verifique seu email para confirmar.");
      navigate("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">
            <span className="text-primary">OS</span>10 — Criar Conta
          </CardTitle>
          <CardDescription>Cadastre-se gratuitamente para começar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input id="name" placeholder="Seu nome" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">WhatsApp (Celular) *</Label>
              <Input id="phone" type="tel" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input id="password" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Área de atuação *</Label>
              <Select value={businessArea} onValueChange={setBusinessArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua área" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {BUSINESS_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                  <SelectItem value="__other__">Outro (digitar)</SelectItem>
                </SelectContent>
              </Select>
              {businessArea === "__other__" && (
                <Input
                  placeholder="Digite sua área de atuação"
                  value={customBusinessArea}
                  onChange={(e) => setCustomBusinessArea(e.target.value)}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Como conheceu o OS10?</Label>
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {ORIGINS.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {origin === "Outro" && (
                <Input
                  placeholder="Digite a origem"
                  value={customOrigin}
                  onChange={(e) => setCustomOrigin(e.target.value)}
                />
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              A validação por código OTP via SMS ficará na próxima etapa de autenticação por telefone.
            </p>

            <Button type="submit" className="w-full os-gradient-primary border-0" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Criar Conta
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem conta? <Link to="/auth/login" className="text-primary hover:underline">Entrar</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
