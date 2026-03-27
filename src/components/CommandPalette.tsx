import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  ClipboardList,
  Users,
  Package,
  Wrench,
  ShoppingCart,
  BarChart3,
  Settings,
  Plus,
  FileText,
  Search,
} from "lucide-react";

const navigationItems = [
  { label: "Início / Dashboard", icon: Home, url: "/", group: "Navegação" },
  { label: "Ordens de Serviço", icon: ClipboardList, url: "/ordens", group: "Navegação" },
  { label: "Clientes", icon: Users, url: "/clientes", group: "Navegação" },
  { label: "Produtos", icon: Package, url: "/produtos", group: "Navegação" },
  { label: "Serviços", icon: Wrench, url: "/servicos", group: "Navegação" },
  { label: "Caixa Rápido", icon: ShoppingCart, url: "/caixa", group: "Navegação" },
  { label: "Relatórios", icon: BarChart3, url: "/relatorios", group: "Navegação" },
  { label: "Configurações", icon: Settings, url: "/config", group: "Navegação" },
];

const actionItems = [
  { label: "Criar Nova O.S.", icon: Plus, url: "/ordens/nova", group: "Ações" },
  { label: "Criar Orçamento", icon: FileText, url: "/ordens/nova", group: "Ações" },
  { label: "Abrir Caixa Rápido", icon: ShoppingCart, url: "/caixa", group: "Ações" },
];

const recentOrders = [
  { label: "OS #2024-001 — Maria Santos", icon: ClipboardList, url: "/ordens/2024-001", group: "Ordens Recentes" },
  { label: "OS #2024-002 — Carlos Oliveira", icon: ClipboardList, url: "/ordens/2024-002", group: "Ordens Recentes" },
  { label: "OS #2024-003 — Ana Costa", icon: ClipboardList, url: "/ordens/2024-003", group: "Ordens Recentes" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    navigate(url);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-muted-foreground text-sm hover:bg-muted transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Buscar...</span>
        <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar ordens, clientes, ações..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

          <CommandGroup heading="Ações Rápidas">
            {actionItems.map((item) => (
              <CommandItem key={item.label} onSelect={() => handleSelect(item.url)}>
                <item.icon className="mr-2 h-4 w-4 text-primary" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Ordens Recentes">
            {recentOrders.map((item) => (
              <CommandItem key={item.label} onSelect={() => handleSelect(item.url)}>
                <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navegação">
            {navigationItems.map((item) => (
              <CommandItem key={item.label} onSelect={() => handleSelect(item.url)}>
                <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
