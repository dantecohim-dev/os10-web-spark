import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList, CheckCircle2, FileText, DollarSign, Plus, ShoppingCart,
  Users, Package, BarChart3, Wrench, ArrowRight, Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSkeleton } from "@/components/ui/premium-skeleton";
import { fmtBRL, fmtDate, statusClass, statusLabel } from "@/lib/orders";

const Dashboard = () => {
  const { profile } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", profile?.company_id],
    queryFn: async () => {
      const cid = profile!.company_id!;
      const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
      const isoMonth = startOfMonth.toISOString();

      const [companyR, ordersR, paymentsR, salesR] = await Promise.all([
        supabase.from("companies").select("name, phone, email").eq("id", cid).maybeSingle(),
        supabase.from("orders").select("id, order_number, status, total, service_date, created_at, client:clients(name)").eq("company_id", cid).order("created_at", { ascending: false }).limit(50),
        supabase.from("order_payments").select("amount, paid_at, order:orders!inner(company_id)").eq("order.company_id", cid).gte("paid_at", isoMonth),
        supabase.from("quick_sales").select("total, sold_at").eq("company_id", cid).gte("sold_at", isoMonth),
      ]);

      const orders = ordersR.data ?? [];
      const open = orders.filter((o: any) => ["authorized", "in_progress"].includes(o.status));
      const completedThisMonth = orders.filter((o: any) => o.status === "completed" && new Date(o.created_at) >= startOfMonth);
      const quotes = orders.filter((o: any) => o.status === "quote");
      const revenue = (paymentsR.data ?? []).reduce((s: number, p: any) => s + Number(p.amount), 0)
        + (salesR.data ?? []).reduce((s: number, q: any) => s + Number(q.total), 0);

      return {
        company: companyR.data,
        recent: orders.slice(0, 5),
        stats: {
          open: open.length,
          completed: completedThisMonth.length,
          quotes: quotes.length,
          revenue,
        },
      };
    },
    enabled: !!profile?.company_id,
  });

  if (isLoading || !data) return <DashboardSkeleton />;

  const stats = [
    { label: "O.S. Abertas", value: String(data.stats.open), icon: ClipboardList, color: "text-primary" },
    { label: "Finalizadas (mês)", value: String(data.stats.completed), icon: CheckCircle2, color: "text-os-success" },
    { label: "Orçamentos", value: String(data.stats.quotes), icon: FileText, color: "text-os-info" },
    { label: "Faturamento (mês)", value: fmtBRL(data.stats.revenue), icon: DollarSign, color: "text-os-warning" },
  ];

  const modules = [
    { label: "Clientes", icon: Users, url: "/clientes" },
    { label: "Produtos", icon: Package, url: "/produtos" },
    { label: "Serviços", icon: Wrench, url: "/servicos" },
    { label: "Relatórios", icon: BarChart3, url: "/relatorios" },
  ];

  const initials = (data.company?.name ?? "OS").split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold font-display tracking-tight">Painel de Controle</h1>
        <p className="text-muted-foreground text-sm mt-1">Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
      </div>

      <div className="animate-fade-in stagger-1">
        <Card className="os-gradient-primary border-0 os-shadow-elevated overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(0_0%_100%/0.12),transparent_60%)]" />
          <CardContent className="p-5 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10">
                <span className="text-primary-foreground font-bold text-lg font-display">{initials}</span>
              </div>
              <div>
                <h2 className="text-primary-foreground font-bold text-lg font-display">{data.company?.name ?? "Sua Empresa"}</h2>
                <p className="text-primary-foreground/80 text-sm flex items-center gap-1"><Sparkles className="h-3 w-3" /> OS10</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-6 text-primary-foreground/90 text-sm">
              {data.company?.phone && <div><span className="block text-primary-foreground/60 text-xs uppercase tracking-wider">Telefone</span>{data.company.phone}</div>}
              {data.company?.email && <div><span className="block text-primary-foreground/60 text-xs uppercase tracking-wider">Email</span>{data.company.email}</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`animate-fade-in stagger-${i + 2}`}>
            <Card className="glass-card-strong os-shadow-card hover:os-shadow-elevated hover:-translate-y-0.5 transition-all duration-300 group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-2xl font-bold font-display tracking-tight truncate">{stat.value}</p>
                  <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="animate-fade-in stagger-5">
        <h3 className="font-semibold font-display mb-3">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="os-gradient-primary border-0"><Link to="/ordens/nova"><Plus className="h-4 w-4 mr-2" />Criar O.S.</Link></Button>
          <Button asChild variant="outline" className="border-os-success text-os-success"><Link to="/ordens/nova?tipo=quote"><FileText className="h-4 w-4 mr-2" />Criar Orçamento</Link></Button>
          <Button asChild variant="outline" className="border-primary text-primary"><Link to="/caixa"><ShoppingCart className="h-4 w-4 mr-2" />Caixa Rápido</Link></Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-fade-in stagger-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold font-display">Ordens Recentes</h3>
            <Link to="/ordens" className="text-sm text-primary hover:underline font-medium">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {data.recent.length === 0 ? (
              <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Nenhuma OS ainda. <Link to="/ordens/nova" className="text-primary underline">Criar a primeira</Link>.</CardContent></Card>
            ) : data.recent.map((order: any) => (
              <Link key={order.id} to={`/ordens/${order.id}`}>
                <Card className="glass-card-strong os-shadow-card hover:os-shadow-elevated hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm font-display">OS #{order.order_number}</span>
                        <Badge variant="secondary" className={statusClass(order.status)}>{statusLabel(order.status)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.client?.name ?? "Sem cliente"}</p>
                      <p className="text-xs text-muted-foreground">{fmtDate(order.created_at)}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <p className="font-bold font-display">{fmtBRL(order.total)}</p>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

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
