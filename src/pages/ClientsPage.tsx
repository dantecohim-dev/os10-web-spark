import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, MapPin, User } from "lucide-react";

interface Client {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  status: "Ativo" | "Inativo";
  osCount: number;
}

const clients: Client[] = [
  { id: "CLI-001", name: "João Silva", company: "Oficina 2 Irmãos", phone: "(99) 99999-9999", email: "joao@email.com", status: "Ativo", osCount: 5 },
  { id: "CLI-002", name: "Maria Santos", phone: "(11) 98888-7777", email: "maria@email.com", status: "Ativo", osCount: 3 },
  { id: "CLI-003", name: "Carlos Oliveira", company: "Construtora ABC", phone: "(11) 97777-6666", email: "carlos@email.com", status: "Ativo", osCount: 8 },
  { id: "CLI-004", name: "Ana Costa", phone: "(11) 96666-5555", email: "ana@email.com", status: "Ativo", osCount: 2 },
  { id: "CLI-005", name: "Carlos Ferreira", phone: "(11) 97777-6666", email: "carlos@email.com", status: "Inativo", osCount: 1 },
  { id: "CLI-006", name: "Tech Solutions Ltd", phone: "(11) 4444-5555", email: "info@tech.com", status: "Ativo", osCount: 15 },
];

const ClientsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar clientes..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-60" />
          </div>
          <Button className="os-gradient-primary border-0">
            <Plus className="h-4 w-4 mr-2" /> Cadastrar Novo Cliente
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <Card key={client.id} className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full os-gradient-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-bold text-sm">{client.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{client.name}</p>
                    {client.company && <p className="text-xs text-muted-foreground">{client.company}</p>}
                    <p className="text-xs text-muted-foreground">ID: {client.id}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={client.status === "Ativo" ? "bg-os-success/10 text-os-success" : "bg-muted text-muted-foreground"}>
                  {client.status}
                </Badge>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{client.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{client.email}</div>
              </div>
              <div className="pt-3 border-t text-xs text-muted-foreground">
                {client.osCount} O.S.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;
