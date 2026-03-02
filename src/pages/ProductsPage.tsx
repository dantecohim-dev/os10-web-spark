import { Card, CardContent } from "@/components/ui/card";
import { Package, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const products = [
  { id: "1", name: "Parafuso Phillips 6×40mm", price: "R$ 2,50", stock: 150, category: "Fixação" },
  { id: "2", name: "Cabo Elétrico 2,5mm", price: "R$ 8,90", stock: 80, category: "Elétrica" },
  { id: "3", name: "Tomada 2P+T 10A", price: "R$ 12,30", stock: 45, category: "Elétrica" },
  { id: "4", name: "Interruptor Simples", price: "R$ 6,75", stock: 60, category: "Elétrica" },
  { id: "5", name: "Lâmpada LED 9W", price: "R$ 15,90", stock: 200, category: "Iluminação" },
  { id: "6", name: "Fita Isolante", price: "R$ 4,50", stock: 120, category: "Elétrica" },
];

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar produtos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-60" />
          </div>
          <Button className="os-gradient-primary border-0"><Plus className="h-4 w-4 mr-2" /> Novo Produto</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.id} className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <Badge variant="secondary">{p.category}</Badge>
              </div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-lg font-bold text-primary mt-1">{p.price}</p>
              <p className="text-xs text-muted-foreground mt-2">Estoque: {p.stock} unidades</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
