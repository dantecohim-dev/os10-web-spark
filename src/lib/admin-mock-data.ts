// ==========================================
// Mock data for OS10 Admin Dashboard
// ==========================================

export const kpiData = {
  totalUsers: 12847,
  activeUsers: 9234,
  newUsersToday: 47,
  newUsersMonth: 1283,
  payingUsers: 3412,
  freeUsers: 9435,
  churnRate: 4.2,
  churnUsers: 143,
  mrr: 58240.00,
  arr: 698880.00,
  arpu: 17.07,
  ltv: 204.84,
  totalDownloads: 48920,
  downloadsMonth: 3847,
  downloadsToday: 128,
  androidDownloads: 31198,
  iosDownloads: 17722,
  conversionRate: 26.6,
  trialToPayRate: 18.4,
  avgTicket: 29.90,
  nps: 72,
};

export const accountsByMonth = [
  { month: "Jul", contas: 820, pagantes: 210 },
  { month: "Ago", contas: 945, pagantes: 248 },
  { month: "Set", contas: 1102, pagantes: 295 },
  { month: "Out", contas: 1230, pagantes: 340 },
  { month: "Nov", contas: 1380, pagantes: 398 },
  { month: "Dez", contas: 1150, pagantes: 365 },
  { month: "Jan", contas: 1420, pagantes: 410 },
  { month: "Fev", contas: 1283, pagantes: 378 },
  { month: "Mar", contas: 1510, pagantes: 445 },
  { month: "Abr", contas: 1380, pagantes: 412 },
  { month: "Mai", contas: 1620, pagantes: 480 },
  { month: "Jun", contas: 1283, pagantes: 430 },
];

export const newPayingByDay = [
  { day: "01", novos: 12 },
  { day: "02", novos: 8 },
  { day: "03", novos: 15 },
  { day: "04", novos: 22 },
  { day: "05", novos: 18 },
  { day: "06", novos: 10 },
  { day: "07", novos: 6 },
  { day: "08", novos: 14 },
  { day: "09", novos: 19 },
  { day: "10", novos: 25 },
  { day: "11", novos: 20 },
  { day: "12", novos: 16 },
  { day: "13", novos: 11 },
  { day: "14", novos: 9 },
  { day: "15", novos: 17 },
  { day: "16", novos: 23 },
  { day: "17", novos: 28 },
  { day: "18", novos: 21 },
  { day: "19", novos: 13 },
  { day: "20", novos: 7 },
  { day: "21", novos: 15 },
  { day: "22", novos: 19 },
  { day: "23", novos: 24 },
  { day: "24", novos: 30 },
  { day: "25", novos: 18 },
  { day: "26", novos: 14 },
  { day: "27", novos: 10 },
  { day: "28", novos: 16 },
  { day: "29", novos: 22 },
  { day: "30", novos: 27 },
];

export const accountsByLocation = [
  { state: "SP", contas: 3240, percentage: 25.2 },
  { state: "RJ", contas: 1820, percentage: 14.2 },
  { state: "MG", contas: 1540, percentage: 12.0 },
  { state: "PR", contas: 980, percentage: 7.6 },
  { state: "RS", contas: 870, percentage: 6.8 },
  { state: "BA", contas: 760, percentage: 5.9 },
  { state: "SC", contas: 650, percentage: 5.1 },
  { state: "GO", contas: 520, percentage: 4.0 },
  { state: "PE", contas: 480, percentage: 3.7 },
  { state: "CE", contas: 420, percentage: 3.3 },
  { state: "Outros", contas: 1567, percentage: 12.2 },
];

export const mrrHistory = [
  { month: "Jul", mrr: 38200 },
  { month: "Ago", mrr: 40800 },
  { month: "Set", mrr: 43500 },
  { month: "Out", mrr: 46100 },
  { month: "Nov", mrr: 49800 },
  { month: "Dez", mrr: 48200 },
  { month: "Jan", mrr: 51400 },
  { month: "Fev", mrr: 53200 },
  { month: "Mar", mrr: 55800 },
  { month: "Abr", mrr: 56400 },
  { month: "Mai", mrr: 57100 },
  { month: "Jun", mrr: 58240 },
];

export const downloadsByPlatform = [
  { month: "Jul", android: 1820, ios: 980 },
  { month: "Ago", android: 2100, ios: 1120 },
  { month: "Set", android: 2340, ios: 1280 },
  { month: "Out", android: 2580, ios: 1350 },
  { month: "Nov", android: 2890, ios: 1520 },
  { month: "Dez", android: 2200, ios: 1180 },
  { month: "Jan", android: 2960, ios: 1580 },
  { month: "Fev", android: 2680, ios: 1420 },
  { month: "Mar", android: 3120, ios: 1650 },
  { month: "Abr", android: 2940, ios: 1560 },
  { month: "Mai", android: 3280, ios: 1740 },
  { month: "Jun", android: 2490, ios: 1357 },
];

export const churnHistory = [
  { month: "Jul", rate: 5.8 },
  { month: "Ago", rate: 5.2 },
  { month: "Set", rate: 4.9 },
  { month: "Out", rate: 5.1 },
  { month: "Nov", rate: 4.7 },
  { month: "Dez", rate: 6.2 },
  { month: "Jan", rate: 4.5 },
  { month: "Fev", rate: 4.8 },
  { month: "Mar", rate: 4.3 },
  { month: "Abr", rate: 4.1 },
  { month: "Mai", rate: 3.9 },
  { month: "Jun", rate: 4.2 },
];

export const planDistribution = [
  { name: "Gratuito", value: 9435, color: "hsl(var(--muted-foreground))" },
  { name: "Básico", value: 1820, color: "hsl(var(--os-info))" },
  { name: "Profissional", value: 1120, color: "hsl(var(--primary))" },
  { name: "Empresarial", value: 472, color: "hsl(var(--os-success))" },
];

export const recentActivity = [
  { id: 1, type: "signup", description: "Novo cadastro: João Silva (SP)", time: "2 min atrás" },
  { id: 2, type: "payment", description: "Upgrade para Profissional: Maria Santos", time: "8 min atrás" },
  { id: 3, type: "churn", description: "Cancelamento: Auto Mecânica XYZ", time: "15 min atrás" },
  { id: 4, type: "signup", description: "Novo cadastro: Pedro Lima (MG)", time: "22 min atrás" },
  { id: 5, type: "payment", description: "Novo pagante: Ana Costa (RJ)", time: "35 min atrás" },
  { id: 6, type: "signup", description: "Novo cadastro: Carlos Souza (BA)", time: "42 min atrás" },
  { id: 7, type: "payment", description: "Renovação anual: Tech Services LTDA", time: "1h atrás" },
  { id: 8, type: "churn", description: "Cancelamento: Oficina do Bairro", time: "1h30 atrás" },
];
