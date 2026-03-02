import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Phone, Share2, Edit, Calendar, Clock, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";

interface Order {
  id: string;
  status: string;
  statusColor: string;
  client: string;
  value: string;
  paymentStatus: string;
  date: string;
  time: string;
  description: string;
  address: string;
  technician: string;
}

const orders: Order[] = [
  { id: "#1247", status: "Pendente", statusColor: "os-pending", client: "João Silva Elétrica", value: "R$ 2.450,00", paymentStatus: "Não pago", date: "15/01/2024", time: "14:30", description: "Instalação elétrica residencial", address: "Rua das Flores, 123", technician: "Técnico A" },
  { id: "#1246", status: "Em Andamento", statusColor: "os-warning", client: "Construtora ABC Ltda", value: "R$ 5.200,00", paymentStatus: "50% pago", date: "14/01/2024", time: "09:00", description: "Manutenção preventiva", address: "Av. Principal, 456", technician: "Técnico B" },
  { id: "#1245", status: "Aguardando", statusColor: "os-warning", client: "Maria Santos", value: "R$ 850,00", paymentStatus: "Não pago", date: "13/01/2024", time: "16:00", description: "Reparo tomada", address: "Rua do Centro, 789", technician: "Técnico A" },
  { id: "#1244", status: "Urgente", statusColor: "os-urgent", client: "Empresarial Park", value: "R$ 3.200,00", paymentStatus: "Não pago", date: "12/01/2024", time: "08:30", description: "Reparo emergencial", address: "Bloco A, Sala 201", technician: "Técnico C" },
  { id: "#1243", status: "Orçamento", statusColor: "os-info", client: "Carlos Ferreira", value: "R$ 1.750,00", paymentStatus: "Aguardando", date: "11/01/2024", time: "10:15", description: "Instalação ar condicionado", address: "Residencial Vista", technician: "Técnico B" },
];

const statusStyles: Record<string, string> = {
  "os-pending": "bg-primary/10 text-primary",
  "os-warning": "bg-os-warning/10 text-os-warning",
  "os-info": "bg-os-info/10 text-os-info",
  "os-urgent": "bg-destructive/10 text-destructive",
  "os-success": "bg-os-success/10 text-os-success",
};

const paymentStyles: Record<string, string> = {
  "Não pago": "text-destructive",
  "50% pago": "text-os-warning",
  "Aguardando": "text-muted-foreground",
  "Pago": "text-os-success",
};

const OrderCard = ({ order }: { order: Order }) => (
  <Link to={`/ordens/${order.id.replace("#", "")}`}>
    <Card className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">OS {order.id}</span>
            <Badge variant="secondary" className={statusStyles[order.statusColor]}>
              {order.status}
            </Badge>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg">{order.value}</p>
            <p className={`text-xs font-medium ${paymentStyles[order.paymentStatus]}`}>{order.paymentStatus}</p>
          </div>
        </div>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{order.client}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{order.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{order.time}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p>{order.description}</p>
            <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{order.address}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />{order.technician}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Share2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><Phone className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const OrdersPage = () => {
  const [search, setSearch] = useState("");
  const totalValue = "R$ 15.420,00";

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suas O.S.s</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ordens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-60"
            />
          </div>
          <Button asChild className="os-gradient-primary border-0">
            <Link to="/ordens/nova"><Plus className="h-4 w-4 mr-2" />Nova O.S.</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="abertas">
        <TabsList className="bg-muted">
          <TabsTrigger value="abertas">Abertas</TabsTrigger>
          <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
          <TabsTrigger value="finalizada">Finalizada</TabsTrigger>
          <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between mt-4 mb-2 text-sm">
          <span className="text-muted-foreground">{orders.length} ordens em aberto</span>
          <span className="font-bold text-primary">{totalValue}</span>
        </div>

        <TabsContent value="abertas" className="space-y-3 mt-0">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        <TabsContent value="orcamento" className="space-y-3 mt-0">
          {orders.filter(o => o.status === "Orçamento").map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
        <TabsContent value="finalizada" className="mt-0">
          <p className="text-muted-foreground text-sm py-8 text-center">Nenhuma ordem finalizada.</p>
        </TabsContent>
        <TabsContent value="andamento" className="space-y-3 mt-0">
          {orders.filter(o => o.status === "Em Andamento").map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
