import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { fmtBRL } from "@/lib/orders";

interface CartItem { id: string; name: string; price: number; qty: number; }

const QuickCheckoutPage = () => {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"products" | "summary" | "payment" | "done">("products");
  const [method, setMethod] = useState("Dinheiro");
  const [notes, setNotes] = useState("");
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products-active", profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, name, price").eq("company_id", profile!.company_id!).eq("active", true).order("name");
      return data ?? [];
    },
    enabled: !!profile?.company_id,
  });

  const addToCart = (p: any) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === p.id);
      if (ex) return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: Number(p.price), qty: 1 }];
    });
  };
  const updateQty = (id: string, d: number) =>
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter((i) => i.qty > 0));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

  const finalize = useMutation({
    mutationFn: async () => {
      if (cart.length === 0) throw new Error("Carrinho vazio");
      const { data: sale, error } = await supabase
        .from("quick_sales")
        .insert({ company_id: profile!.company_id!, total, payment_method: method, notes: notes || null })
        .select("id")
        .single();
      if (error) throw error;
      const { error: e2 } = await supabase.from("quick_sale_items").insert(
        cart.map((i) => ({
          quick_sale_id: sale.id, product_id: i.id, name: i.name, price: i.price, quantity: i.qty, subtotal: i.price * i.qty,
        }))
      );
      if (e2) throw e2;
      return sale.id;
    },
    onSuccess: (saleId) => {
      setLastSaleId(saleId);
      setStep("done");
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Venda registrada!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (step === "done") {
    return (
      <div className="animate-fade-in max-w-lg mx-auto text-center space-y-6 py-12">
        <div className="w-20 h-20 rounded-full bg-os-success flex items-center justify-center mx-auto">
          <span className="text-os-success-foreground text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold">Venda finalizada!</h1>
        <Card className="os-shadow-card text-left">
          <CardContent className="p-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Venda</span><span className="font-mono text-xs">{lastSaleId?.slice(0, 8)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pagamento</span><span>{method}</span></div>
            <Separator />
            {cart.map((i) => (
              <div key={i.id} className="flex justify-between">
                <div><p className="font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.qty} × {fmtBRL(i.price)}</p></div>
                <span className="font-medium">{fmtBRL(i.price * i.qty)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{fmtBRL(total)}</span></div>
          </CardContent>
        </Card>
        <Button className="w-full os-gradient-primary border-0" onClick={() => { setCart([]); setNotes(""); setStep("products"); }}>Nova Venda</Button>
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
          <p className="text-primary-foreground text-3xl font-bold">{fmtBRL(total)}</p>
        </div>
        <div>
          <p className="text-sm font-medium mb-3">Método de Pagamento</p>
          <div className="grid grid-cols-2 gap-3">
            {["Dinheiro", "PIX", "Cartão Crédito", "Cartão Débito", "Fiado", "Outro"].map((m) => (
              <Button key={m} variant={method === m ? "default" : "outline"} className={method === m ? "os-gradient-primary border-0 h-16" : "h-16"} onClick={() => setMethod(m)}>{m}</Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Observações</p>
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Opcional" />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep("summary")}>Voltar</Button>
          <Button className="flex-1 os-gradient-primary border-0 h-12" disabled={finalize.isPending} onClick={() => finalize.mutate()}>
            {finalize.isPending ? "Salvando..." : "Finalizar Venda"}
          </Button>
        </div>
      </div>
    );
  }

  if (step === "summary") {
    return (
      <div className="animate-fade-in max-w-lg mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setStep("products")}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold">Resumo</h1>
        </div>
        <div className="space-y-3">
          {cart.map((i) => (
            <Card key={i.id} className="os-shadow-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div><p className="font-medium text-sm">{i.name}</p><p className="text-xs text-primary">{fmtBRL(i.price)} cada</p></div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => updateQty(i.id, -1)}><Minus className="h-3 w-3" /></Button>
                  <span className="font-medium w-6 text-center">{i.qty}</span>
                  <Button size="icon" className="h-8 w-8 rounded-full os-gradient-primary border-0" onClick={() => updateQty(i.id, 1)}><Plus className="h-3 w-3" /></Button>
                  <span className="font-bold w-20 text-right">{fmtBRL(i.price * i.qty)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="os-shadow-card">
          <CardContent className="p-4 flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{fmtBRL(total)}</span></CardContent>
        </Card>
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={() => setStep("products")}>Adicionar mais</Button>
          <Button className="w-full os-gradient-primary border-0 h-12" onClick={() => setStep("payment")}>Ir para o Pagamento</Button>
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

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Pesquisar produtos" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <div className="space-y-2">{[1,2,3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">Nenhum produto cadastrado.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((p: any) => (
            <Card key={p.id} className="os-shadow-card hover:os-shadow-elevated transition-all cursor-pointer" onClick={() => addToCart(p)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div><p className="font-medium text-sm">{p.name}</p><p className="text-sm text-primary font-medium">{fmtBRL(p.price)}</p></div>
                <Button size="icon" variant="outline" className="h-9 w-9 rounded-full border-primary text-primary"><Plus className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="border-t pt-4 space-y-2">
          {cart.map((i) => (
            <div key={i.id} className="flex justify-between text-sm"><span>{i.name} × {i.qty}</span><span className="font-medium">{fmtBRL(i.price * i.qty)}</span></div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{fmtBRL(total)}</span></div>
          <Button className="w-full os-gradient-primary border-0 h-12" onClick={() => setStep("summary")}>Ir para Resumo</Button>
        </div>
      )}
    </div>
  );
};

export default QuickCheckoutPage;
