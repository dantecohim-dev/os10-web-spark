import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Phone, Mail, Bell, Shield, Palette } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Card className="os-shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome</Label><Input defaultValue="João Varejo" /></div>
            <div className="space-y-2"><Label>Email</Label><Input defaultValue="joao@email.com" /></div>
            <div className="space-y-2"><Label>Telefone</Label><Input defaultValue="(11) 99999-9999" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Nome da Empresa</Label><Input defaultValue="Servevarejo Tecnologia" /></div>
            <div className="space-y-2"><Label>CNPJ</Label><Input defaultValue="12.345.678/0001-90" /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Notificações por email", "Alertas de novas O.S.", "Resumo semanal"].map(item => (
            <div key={item} className="flex items-center justify-between">
              <Label>{item}</Label>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button className="os-gradient-primary border-0">Salvar Alterações</Button>
    </div>
  );
};

export default SettingsPage;
