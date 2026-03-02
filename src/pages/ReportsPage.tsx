import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, ClipboardList } from "lucide-react";

const ReportsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Faturamento Mensal", value: "R$ 12.450,00", icon: DollarSign, change: "+12%" },
          { label: "O.S. Finalizadas", value: "28", icon: ClipboardList, change: "+5" },
          { label: "Ticket Médio", value: "R$ 445,00", icon: TrendingUp, change: "+8%" },
          { label: "Taxa de Conversão", value: "78%", icon: BarChart3, change: "+3%" },
        ].map(s => (
          <Card key={s.label} className="os-shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-os-success">{s.change}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="os-shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Faturamento por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-48">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t os-gradient-primary" style={{ height: `${h}%` }} />
                <span className="text-[10px] text-muted-foreground">{["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
