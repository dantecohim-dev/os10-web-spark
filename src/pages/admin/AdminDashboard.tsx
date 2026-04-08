import {
  Users,
  UserCheck,
  UserPlus,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  Target,
  Star,
  Smartphone,
  Apple,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  kpiData,
  accountsByMonth,
  newPayingByDay,
  accountsByLocation,
  mrrHistory,
  downloadsByPlatform,
  churnHistory,
  planDistribution,
  recentActivity,
} from "@/lib/admin-mock-data";
import { Badge } from "@/components/ui/badge";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  accentColor?: string;
  delay?: number;
}

function KpiCard({ title, value, subtitle, icon: Icon, trend, accentColor = "primary", delay = 0 }: KpiCardProps) {
  return (
    <div
      className={`glass-card-strong rounded-2xl p-5 hover:os-shadow-elevated transition-all duration-300 hover:-translate-y-0.5 animate-fade-in stagger-${delay}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}
          style={{ background: `hsl(var(--${accentColor}) / 0.12)` }}
        >
          <Icon className="h-5 w-5" style={{ color: `hsl(var(--${accentColor}))` }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend.value >= 0 ? "text-emerald-600" : "text-red-500"}`}>
            {trend.value >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-foreground tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{title}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{subtitle}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Visão geral da plataforma OS10</p>
        </div>
        <Badge variant="outline" className="text-xs gap-1.5">
          <Activity className="h-3 w-3 text-emerald-500" />
          Atualizado agora
        </Badge>
      </div>

      {/* KPI Grid - Row 1: Users */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Total de Usuários"
          value={formatNumber(kpiData.totalUsers)}
          icon={Users}
          trend={{ value: 12.5, label: "vs mês anterior" }}
          accentColor="os-info"
          delay={1}
        />
        <KpiCard
          title="Usuários Ativos"
          value={formatNumber(kpiData.activeUsers)}
          subtitle={`${((kpiData.activeUsers / kpiData.totalUsers) * 100).toFixed(1)}% do total`}
          icon={UserCheck}
          trend={{ value: 8.3, label: "" }}
          accentColor="os-success"
          delay={2}
        />
        <KpiCard
          title="Novos Hoje"
          value={formatNumber(kpiData.newUsersToday)}
          icon={UserPlus}
          trend={{ value: 15.2, label: "" }}
          accentColor="primary"
          delay={3}
        />
        <KpiCard
          title="Pagantes"
          value={formatNumber(kpiData.payingUsers)}
          subtitle={`${kpiData.conversionRate}% conversão`}
          icon={CreditCard}
          trend={{ value: 6.1, label: "" }}
          accentColor="os-success"
          delay={4}
        />
        <KpiCard
          title="MRR"
          value={formatCurrency(kpiData.mrr)}
          subtitle={`ARR: ${formatCurrency(kpiData.arr)}`}
          icon={DollarSign}
          trend={{ value: 9.8, label: "" }}
          accentColor="primary"
          delay={5}
        />
        <KpiCard
          title="Churn Rate"
          value={`${kpiData.churnRate}%`}
          subtitle={`${kpiData.churnUsers} cancelamentos`}
          icon={TrendingDown}
          trend={{ value: -0.7, label: "" }}
          accentColor="os-urgent"
          delay={6}
        />
      </div>

      {/* KPI Grid - Row 2: Business metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Downloads Total"
          value={formatNumber(kpiData.totalDownloads)}
          subtitle={`Hoje: ${kpiData.downloadsToday}`}
          icon={Download}
          trend={{ value: 18.4, label: "" }}
          accentColor="os-info"
          delay={1}
        />
        <KpiCard
          title="Ticket Médio"
          value={formatCurrency(kpiData.avgTicket)}
          icon={Target}
          trend={{ value: 3.2, label: "" }}
          accentColor="primary"
          delay={2}
        />
        <KpiCard
          title="ARPU"
          value={formatCurrency(kpiData.arpu)}
          subtitle={`LTV: ${formatCurrency(kpiData.ltv)}`}
          icon={TrendingUp}
          trend={{ value: 5.1, label: "" }}
          accentColor="os-success"
          delay={3}
        />
        <KpiCard
          title="NPS"
          value={String(kpiData.nps)}
          subtitle="Zona de qualidade"
          icon={Star}
          trend={{ value: 4.0, label: "" }}
          accentColor="os-warning"
          delay={4}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts by Month */}
        <Card className="glass-card-strong border-0 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Contas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                contas: { label: "Total", color: "hsl(var(--os-info))" },
                pagantes: { label: "Pagantes", color: "hsl(var(--primary))" },
              }}
              className="h-[280px] w-full"
            >
              <BarChart data={accountsByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="month" className="text-[10px]" />
                <YAxis className="text-[10px]" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="contas" fill="var(--color-contas)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pagantes" fill="var(--color-pagantes)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* MRR Evolution */}
        <Card className="glass-card-strong border-0 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Evolução do MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                mrr: { label: "MRR", color: "hsl(var(--primary))" },
              }}
              className="h-[280px] w-full"
            >
              <AreaChart data={mrrHistory}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="month" className="text-[10px]" />
                <YAxis className="text-[10px]" tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="mrr" stroke="var(--color-mrr)" fill="url(#mrrGradient)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Paying by Day */}
        <Card className="glass-card-strong border-0 rounded-2xl lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Novos Pagantes por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                novos: { label: "Novos", color: "hsl(var(--os-success))" },
              }}
              className="h-[250px] w-full"
            >
              <AreaChart data={newPayingByDay}>
                <defs>
                  <linearGradient id="novosGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--os-success))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--os-success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="day" className="text-[10px]" />
                <YAxis className="text-[10px]" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="novos" stroke="var(--color-novos)" fill="url(#novosGradient)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="glass-card-strong border-0 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Distribuição por Plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: plan.color }} />
                  <span className="text-muted-foreground">{plan.name}</span>
                  <span className="ml-auto font-medium">{formatNumber(plan.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Downloads by Platform */}
        <Card className="glass-card-strong border-0 rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-base">Downloads por Plataforma</CardTitle>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="h-3 w-3 text-emerald-500" /> Android
                </span>
                <span className="flex items-center gap-1.5">
                  <Apple className="h-3 w-3 text-blue-500" /> iOS
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                android: { label: "Android", color: "hsl(var(--os-success))" },
                ios: { label: "iOS", color: "hsl(var(--os-info))" },
              }}
              className="h-[260px] w-full"
            >
              <BarChart data={downloadsByPlatform}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="month" className="text-[10px]" />
                <YAxis className="text-[10px]" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="android" fill="var(--color-android)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ios" fill="var(--color-ios)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Churn Rate History */}
        <Card className="glass-card-strong border-0 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Evolução do Churn</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: { label: "Churn %", color: "hsl(var(--os-urgent))" },
              }}
              className="h-[260px] w-full"
            >
              <LineChart data={churnHistory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis dataKey="month" className="text-[10px]" />
                <YAxis className="text-[10px]" domain={[0, 8]} tickFormatter={(v) => `${v}%`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Location + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accounts by Location */}
        <Card className="glass-card-strong border-0 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Contas por Localidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accountsByLocation.map((loc) => (
                <div key={loc.state} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-12 shrink-0">{loc.state}</span>
                  <div className="flex-1 h-6 bg-muted/50 rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all duration-500"
                      style={{
                        width: `${loc.percentage * 3.5}%`,
                        background: `hsl(var(--primary) / ${0.4 + loc.percentage * 0.025})`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-right">
                    {formatNumber(loc.contas)} ({loc.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card-strong border-0 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.type === "signup"
                        ? "bg-emerald-500"
                        : item.type === "payment"
                        ? "bg-blue-500"
                        : "bg-red-400"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.description}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-2.5 w-2.5" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
