import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Calendar, User as UserIcon, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { fmtBRL, fmtDate, statusClass, statusLabel } from "@/lib/orders";

const OrdersPage = () => {
  const { profile } = useAuth();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<string>("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", profile?.company_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, title, status, type, total, service_date, created_at, client:clients(name)")
        .eq("company_id", profile!.company_id!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!profile?.company_id,
  });

  const filtered = orders.filter((o: any) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      String(o.order_number).includes(q) ||
      o.title?.toLowerCase().includes(q) ||
      o.client?.name?.toLowerCase().includes(q);
    const matchTab =
      tab === "all" ||
      (tab === "open" && ["authorized", "in_progress"].includes(o.status)) ||
      (tab === "quote" && o.status === "quote") ||
      (tab === "done" && o.status === "completed") ||
      (tab === "lost" && o.status === "lost");
    return matchSearch && matchTab;
  });

  const totalValue = filtered.reduce((sum: number, o: any) => sum + Number(o.total ?? 0), 0);

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Suas O.S.s</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número, cliente, título..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-72"
            />
          </div>
          <Button asChild variant="outline">
            <Link to="/ordens/nova?tipo=quote"><FileText className="h-4 w-4 mr-2" />Orçamento</Link>
          </Button>
          <Button asChild className="os-gradient-primary border-0">
            <Link to="/ordens/nova"><Plus className="h-4 w-4 mr-2" />Nova O.S.</Link>
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="open">Abertas</TabsTrigger>
          <TabsTrigger value="quote">Orçamento</TabsTrigger>
          <TabsTrigger value="done">Finalizada</TabsTrigger>
          <TabsTrigger value="lost">Canceladas</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{filtered.length} ordens</span>
        <span className="font-bold text-primary">{fmtBRL(totalValue)}</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma ordem encontrada.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((o: any) => (
            <Link key={o.id} to={`/ordens/${o.id}`}>
              <Card className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">OS #{o.order_number}</span>
                      <Badge variant="secondary" className={statusClass(o.status)}>{statusLabel(o.status)}</Badge>
                      {o.type === "quote" && <Badge variant="outline" className="text-os-info border-os-info">Orçamento</Badge>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{fmtBRL(o.total)}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-sm">
                      <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{o.client?.name ?? "Sem cliente"}</span>
                    </div>
                    {o.title && <p className="text-sm text-muted-foreground">{o.title}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Criada {fmtDate(o.created_at)}</span>
                      {o.service_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Serviço {fmtDate(o.service_date)}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
