import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Minus, Camera, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  product: Product;
  qty: number;
}

const products: Product[] = [
  { id: "1", name: "Parafuso Phillips 6×40mm", price: 2.50 },
  { id: "2", name: "Cabo Elétrico 2,5mm", price: 8.90 },
  { id: "3", name: "Tomada 2P+T 10A", price: 12.30 },
  { id: "4", name: "Interruptor Simples", price: 6.75 },
  { id: "5", name: "Lâmpada LED 9W", price: 15.90 },
];

const QuickCheckoutPage = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"products" | "summary" | "payment" | "done">("products");

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const fmt = (v: number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (step === "done") {
    return (
      <div className="animate-fade-in max-w-lg mx-auto text-center space-y-6 py-12">
        <div className="w-20 h-20 rounded-full bg-os-success flex items-center justify-center mx-auto">
          <span className="text-os-success-foreground text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold">Venda finalizada com Sucesso!</h1>
        <p className="text-muted-foreground">Your transaction has been processed</p>
        <Card className="os-shadow-card text-left">
          <CardContent className="p-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Venda #</span><span className="font-bold">QC-2024-0158</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Data e Hora</span><span>11 Nov, 2024 - 15:32</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Cliente</span><span>Cliente passante</span></div>
            <Separator />
            {cart.map(i => (
              <div key={i.product.id} className="flex justify-between">
                <div><p className="font-medium">{i.product.name}</p><p className="text-xs text-muted-foreground">Qty: {i.qty} × {fmt(i.product.price)}</p></div>
                <span className="font-medium">{fmt(i.product.price * i.qty)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between"><span>Subtotal</span><span>{fmt(total)}</span></div>
            <div className="flex justify-between"><span>Desconto</span><span>R$ 0,00</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{fmt(total)}</span></div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">Enviar PDF</Button>
          <Button className="flex-1 os-gradient-primary border-0" onClick={() => { setCart([]); setStep("products"); }}>Nova Venda</Button>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="animate-fade-in max-w-lg mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setStep("summary")}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold">Pagamento</h1>
        </div>
        <div className="os-gradient-primary rounded-lg p-5">
          <p className="text-primary-foreground/80 text-sm">Valor Total</p>
          <p className="text-primary-foreground text-3xl font-bold">{fmt(total)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente (Opcional)</label>
            <Button variant="outline" className="w-full justify-start text-primary">
              <Plus className="h-4 w-4 mr-2" /> Adicionar Cliente
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Valor Recebido</label>
            <Input defaultValue={total.toFixed(2).replace(".", ",")} className="text-lg" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Payment Method</span>
            <button className="text-sm text-primary font-medium">Aplicar Desconto</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Dinheiro", "Crédito", "Débito", "PIX", "Fiado", "Outro"].map(m => (
              <Button key={m} variant="outline" className="h-16 flex flex-col gap-1 hover:border-primary hover:text-primary">
                <span className="text-sm font-medium">{m}</span>
              </Button>
            ))}
          </div>
        </div>
        <Card className="bg-muted/50"><CardContent className="p-4 flex justify-between items-center"><span className="text-sm font-medium">Troco</span><span className="text-xl font-bold">R$ 0,00</span></CardContent></Card>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep("summary")}>Cancelar</Button>
          <Button className="flex-1 os-gradient-primary border-0 h-12 text-base" onClick={() => setStep("done")}>Finalizar Venda</Button>
        </div>
      </div>
    );
  }

  if (step === "summary") {
    return (
      <div className="animate-fade-in max-w-lg mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setStep("products")}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold">Resumo da Venda</h1>
        </div>
        <div className="space-y-3">
          {cart.map(i => (
            <Card key={i.product.id} className="os-shadow-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div><p className="font-medium text-sm">{i.product.name}</p><p className="text-xs text-primary">{fmt(i.product.price)} cada</p></div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQty(i.product.id, -1)}><Minus className="h-3 w-3" /></Button>
                  <span className="font-medium w-6 text-center">{i.qty}</span>
                  <Button size="icon" className="h-8 w-8 rounded-full os-gradient-primary border-0" onClick={() => updateQty(i.product.id, 1)}><Plus className="h-3 w-3" /></Button>
                  <span className="font-bold w-16 text-right">{fmt(i.product.price * i.qty)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="os-shadow-card">
          <CardContent className="p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(total)}</span></div>
            <div className="flex justify-between font-bold text-lg"><span>Final Total</span><span className="text-primary">{fmt(total)}</span></div>
          </CardContent>
        </Card>
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={() => setStep("products")}>Adicionar mais</Button>
          <Button className="w-full os-gradient-primary border-0 h-12 text-base" onClick={() => setStep("payment")}>Ir para o Pagamento</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild><Link to="/"><ArrowLeft className="h-5 w-5" /></Link></Button>
        <h1 className="text-xl font-bold">Caixa Rápido</h1>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Pesquisar produtos" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button size="icon" className="os-gradient-primary border-0 shrink-0"><Plus className="h-5 w-5" /></Button>
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <Card key={p.id} className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer" onClick={() => addToCart(p)}>
            <CardContent className="p-4 flex items-center justify-between">
              <div><p className="font-medium text-sm">{p.name}</p><p className="text-sm text-primary font-medium">{fmt(p.price)}</p></div>
              <Button size="icon" variant="outline" className="h-9 w-9 rounded-full border-primary text-primary hover:bg-primary/10"><Plus className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="border-t pt-4 space-y-2">
          {cart.map(i => (
            <div key={i.product.id} className="flex justify-between text-sm"><span>{i.product.name} × {i.qty}</span><span className="font-medium">{fmt(i.product.price * i.qty)}</span></div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{fmt(total)}</span></div>
          <Button className="w-full os-gradient-primary border-0 h-12 text-base" onClick={() => setStep("summary")}>Ir para Resumo da Venda</Button>
        </div>
      )}
    </div>
  );
};

export default QuickCheckoutPage;
