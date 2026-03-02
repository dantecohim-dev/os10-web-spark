import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  CheckCircle2,
  FileText,
  DollarSign,
  Plus,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "O.S. Abertas", value: "24", icon: ClipboardList, color: "text-primary" },
  { label: "Finalizadas", value: "8", icon: CheckCircle2, color: "text-os-success" },
  { label: "Orçamentos", value: "12", icon: FileText, color: "text-os-info" },
  { label: "Faturamento", value: "R$ 8.5k", icon: DollarSign, color: "text-os-warning" },
];

const recentOrders = [
  { id: "#2024-001", status: "Finalizada", statusColor: "os-success", client: "Maria Santos", value: "R$ 450,00", date: "20/12/2024" },
  { id: "#2024-002", status: "Em Andamento", statusColor: "os-warning", client: "Carlos Oliveira", value: "R$ 1.200,00", date: "22/12/2024" },
  { id: "#2024-003", status: "Orçamento", statusColor: "os-info", client: "Ana Costa", value: "R$ 750,00", date: "25/12/2024" },
  { id: "#2024-004", status: "Pendente", statusColor: "os-pending", client: "João Silva", value: "R$ 2.450,00", date: "15/01/2025" },
];

const modules = [
  { label: "Clientes", count: "248 cadastrados", icon: Users, url: "/clientes" },
  { label: "Produtos", count: "142 itens", icon: Package, url: "/produtos" },
  { label: "Relatórios", count: "Análises", icon: BarChart3, url: "/relatorios" },
  { label: "Serviços", count: "18 tipos", icon: Wrench, url: "/servicos" },
];

const statusBgMap: Record<string, string> = {
  "os-success": "bg-os-success/10 text-os-success",
  "os-warning": "bg-os-warning/10 text-os-warning",
  "os-info": "bg-os-info/10 text-os-info",
  "os-pending": "bg-primary/10 text-primary",
};

const statusDotMap: Record<string, string> = {
  "os-success": "bg-os-success",
  "os-warning": "bg-os-warning",
  "os-info": "bg-os-info",
  "os-pending": "bg-primary",
};

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
        <p className="text-muted-foreground text-sm">Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
      </div>

      {/* Business Card */}
      <Card className="os-gradient-primary border-0 os-shadow-elevated">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">ST</span>
            </div>
            <div>
              <h2 className="text-primary-foreground font-bold text-lg">Servevarejo Tecnologia</h2>
              <p className="text-primary-foreground/80 text-sm">Assinatura Business ✦</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-6 text-primary-foreground/90 text-sm">
            <div><span className="block text-primary-foreground/60 text-xs">Telefone</span>(11) 99999-9999</div>
            <div><span className="block text-primary-foreground/60 text-xs">Email</span>joao@email.com</div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="os-shadow-card hover:os-shadow-elevated transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-semibold mb-3">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="os-gradient-primary border-0 hover:opacity-90">
            <Link to="/ordens/nova">
              <Plus className="h-4 w-4 mr-2" /> Criar O.S.
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-os-success text-os-success hover:bg-os-success/10">
            <Link to="/ordens/nova">
              <FileText className="h-4 w-4 mr-2" /> Criar Orçamento
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link to="/caixa">
              <ShoppingCart className="h-4 w-4 mr-2" /> Caixa Rápido
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Orders + Modules */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Ordens Recentes</h3>
            <Link to="/ordens" className="text-sm text-primary hover:underline font-medium">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Card key={order.id} className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">OS {order.id}</span>
                        <Badge variant="secondary" className={statusBgMap[order.statusColor]}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.client}</p>
                      <p className="text-xs text-muted-foreground">Entrega: {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold">{order.value}</p>
                      <span className={`inline-block w-2 h-2 rounded-full ${statusDotMap[order.statusColor]}`} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div>
          <h3 className="font-semibold mb-3">Módulos</h3>
          <div className="grid grid-cols-2 gap-3">
            {modules.map((mod) => (
              <Link key={mod.label} to={mod.url}>
                <Card className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer hover:border-primary/30">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{mod.label}</span>
                    <span className="text-xs text-muted-foreground">{mod.count}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
