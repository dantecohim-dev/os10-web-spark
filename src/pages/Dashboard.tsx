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
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DashboardSkeleton } from "@/components/ui/premium-skeleton";

const stats = [
  { label: "O.S. Abertas", value: "24", icon: ClipboardList, color: "text-primary", trend: "+3", trendUp: true },
  { label: "Finalizadas", value: "8", icon: CheckCircle2, color: "text-os-success", trend: "+2", trendUp: true },
  { label: "Orçamentos", value: "12", icon: FileText, color: "text-os-info", trend: "-1", trendUp: false },
  { label: "Faturamento", value: "R$ 8.5k", icon: DollarSign, color: "text-os-warning", trend: "+12%", trendUp: true },
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold font-display tracking-tight">Painel de Controle</h1>
        <p className="text-muted-foreground text-sm mt-1">Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
      </div>

      {/* Business Card — glass */}
      <div className="animate-fade-in stagger-1">
        <Card className="os-gradient-primary border-0 os-shadow-elevated overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(0_0%_100%/0.12),transparent_60%)]" />
          <CardContent className="p-5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10">
                <span className="text-primary-foreground font-bold text-lg font-display">ST</span>
              </div>
              <div>
                <h2 className="text-primary-foreground font-bold text-lg font-display">Servevarejo Tecnologia</h2>
                <p className="text-primary-foreground/80 text-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Assinatura Business
                </p>
              </div>
            </div>
            <div className="hidden sm:flex gap-6 text-primary-foreground/90 text-sm">
              <div><span className="block text-primary-foreground/60 text-xs font-medium uppercase tracking-wider">Telefone</span>(11) 99999-9999</div>
              <div><span className="block text-primary-foreground/60 text-xs font-medium uppercase tracking-wider">Email</span>joao@email.com</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats — glass cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`animate-fade-in stagger-${i + 2}`}>
            <Card className="glass-card-strong os-shadow-card hover:os-shadow-elevated hover:-translate-y-0.5 transition-all duration-300 group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold font-display tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                    <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${stat.trendUp ? 'text-os-success' : 'text-destructive'}`}>
                      {stat.trendUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in stagger-5">
        <h3 className="font-semibold font-display mb-3">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="os-gradient-primary border-0 hover:opacity-90 os-shadow-glow hover:scale-[1.02] transition-all duration-200">
            <Link to="/ordens/nova">
              <Plus className="h-4 w-4 mr-2" /> Criar O.S.
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-os-success text-os-success hover:bg-os-success/10 hover:scale-[1.02] transition-all duration-200">
            <Link to="/ordens/nova">
              <FileText className="h-4 w-4 mr-2" /> Criar Orçamento
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:scale-[1.02] transition-all duration-200">
            <Link to="/caixa">
              <ShoppingCart className="h-4 w-4 mr-2" /> Caixa Rápido
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Orders + Modules */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 animate-fade-in stagger-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold font-display">Ordens Recentes</h3>
            <Link to="/ordens" className="text-sm text-primary hover:underline font-medium">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, i) => (
              <Card key={order.id} className="glass-card-strong os-shadow-card hover:os-shadow-elevated hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${statusDotMap[order.statusColor]} opacity-80`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm font-display">OS {order.id}</span>
                        <Badge variant="secondary" className={statusBgMap[order.statusColor]}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.client}</p>
                      <p className="text-xs text-muted-foreground">Entrega: {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="font-bold font-display">{order.value}</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div className="animate-fade-in stagger-6">
          <h3 className="font-semibold font-display mb-3">Módulos</h3>
          <div className="grid grid-cols-2 gap-3">
            {modules.map((mod) => (
              <Link key={mod.label} to={mod.url}>
                <Card className="glass-card-strong os-shadow-card hover:os-shadow-elevated hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium font-display">{mod.label}</span>
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
