import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const services = [
  { id: "1", name: "Instalação Elétrica", price: "R$ 150,00", unit: "por serviço", category: "Elétrica", active: true },
  { id: "2", name: "Manutenção Preventiva", price: "R$ 200,00", unit: "por hora", category: "Manutenção", active: true },
  { id: "3", name: "Reparo Hidráulico", price: "R$ 120,00", unit: "por serviço", category: "Hidráulica", active: true },
  { id: "4", name: "Instalação Ar Condicionado", price: "R$ 350,00", unit: "por unidade", category: "Climatização", active: true },
  { id: "5", name: "Pintura Residencial", price: "R$ 80,00", unit: "por m²", category: "Pintura", active: false },
];

const ServicesPage = () => {
  const [search, setSearch] = useState("");
  const filtered = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar serviços..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-60" />
          </div>
          <Button className="os-gradient-primary border-0"><Plus className="h-4 w-4 mr-2" /> Novo Serviço</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <Card key={s.id} className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Wrench className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className={s.active ? "bg-os-success/10 text-os-success" : "bg-muted text-muted-foreground"}>
                  {s.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-lg font-bold text-primary mt-1">{s.price}</p>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{s.unit}</span>
                <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
