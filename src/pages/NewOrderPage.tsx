import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, User, Wrench, Package, Settings2, Calendar, MessageSquare, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

const NewOrderPage = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/ordens"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-xl font-bold">Nova O.S.</h1>
      </div>

      <div className="space-y-5">
        {/* Cliente */}
        <Card className="os-shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="os-gradient-primary border-0 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Adicionar Cliente
            </Button>
          </CardContent>
        </Card>

        {/* Serviços */}
        <Card className="os-shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" /> Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="os-gradient-primary border-0 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Adicionar Serviço
            </Button>
          </CardContent>
        </Card>

        {/* Produtos */}
        <Card className="os-shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="os-gradient-primary border-0 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Adicionar Produto
            </Button>
          </CardContent>
        </Card>

        {/* Equipamento */}
        <Card className="os-shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" /> Equipamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="os-gradient-primary border-0 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" /> Adicionar Equipamento
            </Button>
          </CardContent>
        </Card>

        {/* Datas */}
        <Card className="os-shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Datas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data do Serviço</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Data de Entrega</Label>
                <Input type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        <Card className="os-shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> Observações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Observações do Cliente</Label>
              <Textarea placeholder="Observações visíveis para o cliente..." />
            </div>
            <div className="space-y-2">
              <Label>Observações Internas</Label>
              <Textarea placeholder="Observações internas (não visíveis para o cliente)..." />
            </div>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card className="os-shadow-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" /> Checklist do Serviço
              </CardTitle>
              <Button variant="outline" size="sm" className="text-primary border-primary">
                <Plus className="h-3 w-3 mr-1" /> Nova Checklist
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Inspeção inicial realizada", "Materiais verificados", "Ferramentas preparadas", "Local de trabalho limpo", "Teste final realizado"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Checkbox id={item} />
                  <Label htmlFor={item} className="text-sm font-normal cursor-pointer">{item}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card className="os-shadow-card">
          <CardContent className="p-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal Serviços:</span><span>R$ 0,00</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal Produtos:</span><span>R$ 0,00</span></div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Desconto Aplicado:</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-primary border-primary text-xs h-7">+ Aplicar Desconto</Button>
                <span>R$ 0,00</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Geral</span>
              <span className="font-bold text-xl text-primary">R$ 0,00</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button className="flex-1 os-gradient-primary border-0 h-12 text-base">
            Criar Ordem de Serviço
          </Button>
          <Button variant="outline" className="h-12" asChild>
            <Link to="/ordens">✕ Cancelar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderPage;
