import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Share2,
  MoreVertical,
  User,
  Phone,
  Mail,
  MapPin,
  Camera,
  RefreshCw,
  Navigation,
  FileSignature,
  Printer,
  Eye,
  Trash2,
  Send,
  Edit,
  ChevronUp,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const OrderDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/ordens"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Detalhes da OS #{id || "1024"}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-primary/10 text-primary">O.S.</Badge>
              <span className="text-sm text-muted-foreground">Criada em 10/01/2025</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon"><Share2 className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card className="os-shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full os-gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">JS</span>
                </div>
                <div>
                  <p className="font-semibold">João Silva</p>
                  <p className="text-sm text-muted-foreground">Oficina 2 Irmãos</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> (99) 99999-9999
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> joao@email.com
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> Rua das Flores, 123 - Centro, FSA - BA
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="os-shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumo da Ordem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-muted-foreground">Número da OS:</span>
                <span className="font-semibold text-right">#{id || "1024"}</span>
                <span className="text-muted-foreground">Tipo de Serviço:</span>
                <span className="font-semibold text-right">Manutenção Elétrica</span>
                <span className="text-muted-foreground">Data de Criação:</span>
                <span className="text-right">10/01/2025</span>
                <span className="text-muted-foreground">Previsão de Entrega:</span>
                <span className="text-right">15/01/2025</span>
                <span className="text-muted-foreground">Valor Total:</span>
                <span className="text-right font-bold text-primary text-lg">R$ 450,00</span>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="os-shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Histórico da Ordem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { event: "Orçamento criado", date: "10/01/2025 às 14:30", color: "bg-os-success" },
                  { event: "Orçamento aprovado", date: "10/01/2025 às 15:45", color: "bg-os-info" },
                  { event: "Agendamento feito", date: "10/01/2025 às 16:00", color: "bg-primary" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${item.color}`} />
                    <div>
                      <p className="text-sm font-medium">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card className="os-shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Camera, label: "Anexar foto", color: "text-primary" },
                  { icon: RefreshCw, label: "Reagendar", color: "text-primary" },
                  { icon: Navigation, label: "Localização", color: "text-destructive" },
                  { icon: FileSignature, label: "Assinar O.S.", color: "text-os-info" },
                  { icon: Printer, label: "Imprimir", color: "text-muted-foreground" },
                  { icon: Eye, label: "Visualizar", color: "text-os-info" },
                  { icon: Trash2, label: "Excluir", color: "text-destructive" },
                  { icon: Send, label: "Enviar", color: "text-primary" },
                ].map((action) => (
                  <Button key={action.label} variant="outline" className="flex flex-col h-auto py-3 gap-1.5">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-[11px]">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="os-shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-primary">Pendente</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Forma de Pagamento:</span>
                <span>À Vista</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor pago:</span>
                <span>R$ 0,00</span>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/ordens/${id}/editar`}>
                  <Edit className="h-4 w-4 mr-2" /> Editar OS
                </Link>
              </Button>
              <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10">
                <ChevronUp className="h-4 w-4 mr-2" /> Alterar Status
              </Button>
            </div>
            <Button className="w-full os-gradient-primary border-0">
              Processar Pagamento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
