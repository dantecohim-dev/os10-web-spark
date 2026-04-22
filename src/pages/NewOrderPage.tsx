import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, User, Wrench, Package, Calendar, MessageSquare, CheckSquare, Trash2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { fmtBRL, calcSubtotalProduct, calcSubtotalService } from "@/lib/orders";

interface OrderServiceLine {
  service_id?: string;
  name: string;
  price: number;
  quantity: number;
}
interface OrderProductLine {
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  discount_pct: number;
}

const NewOrderPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [params] = useSearchParams();
  const initialType = params.get("tipo") === "quote" ? "quote" : "os";

  const [type, setType] = useState<"os" | "quote">(initialType);
  const [clientId, setClientId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [objectDescription, setObjectDescription] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [publicNotes, setPublicNotes] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [discount, setDiscount] = useState(0);
  const [services, setServices] = useState<OrderServiceLine[]>([]);
  const [products, setProducts] = useState<OrderProductLine[]>([]);
  const [checklistId, setChecklistId] = useState<string>("");

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-min", profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name").eq("company_id", profile!.company_id!).order("name");
      return data ?? [];
    },
    enabled: !!profile?.company_id,
  });

  const { data: serviceCatalog = [] } = useQuery({
    queryKey: ["services-min", profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("id, name, price").eq("company_id", profile!.company_id!).eq("active", true).order("name");
      return data ?? [];
    },
    enabled: !!profile?.company_id,
  });

  const { data: productCatalog = [] } = useQuery({
    queryKey: ["products-min", profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, name, price").eq("company_id", profile!.company_id!).eq("active", true).order("name");
      return data ?? [];
    },
    enabled: !!profile?.company_id,
  });

  const { data: checklists = [] } = useQuery({
    queryKey: ["checklists-min", profile?.company_id],
    queryFn: async () => {
      const { data } = await supabase.from("checklists").select("id, name, checklist_items(id, description, sort_order)").eq("company_id", profile!.company_id!).order("name");
      return data ?? [];
    },
    enabled: !!profile?.company_id,
  });

  const subtotalServices = useMemo(
    () => services.reduce((s, it) => s + calcSubtotalService(it.price, it.quantity), 0),
    [services]
  );
  const subtotalProducts = useMemo(
    () => products.reduce((s, it) => s + calcSubtotalProduct(it.price, it.quantity, it.discount_pct), 0),
    [products]
  );
  const total = Math.max(0, subtotalServices + subtotalProducts - Number(discount || 0));

  const addService = (id: string) => {
    const s = serviceCatalog.find((x: any) => x.id === id);
    if (!s) return;
    setServices((p) => [...p, { service_id: s.id, name: s.name, price: Number(s.price), quantity: 1 }]);
  };
  const addProduct = (id: string) => {
    const p = productCatalog.find((x: any) => x.id === id);
    if (!p) return;
    setProducts((prev) => [...prev, { product_id: p.id, name: p.name, price: Number(p.price), quantity: 1, discount_pct: 0 }]);
  };

  const createOrder = useMutation({
    mutationFn: async () => {
      if (!profile?.company_id) throw new Error("Sem empresa");
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          company_id: profile.company_id,
          client_id: clientId || null,
          type,
          status: type === "quote" ? "quote" : "authorized",
          title: title || null,
          object_description: objectDescription || null,
          service_date: serviceDate || null,
          delivery_date: deliveryDate || null,
          public_notes: publicNotes || null,
          internal_notes: internalNotes || null,
          discount: Number(discount) || 0,
          total,
        })
        .select("id, order_number")
        .single();
      if (error) throw error;

      if (services.length > 0) {
        const { error: e2 } = await supabase.from("order_services").insert(
          services.map((s) => ({
            order_id: order.id,
            service_id: s.service_id ?? null,
            name: s.name,
            price: s.price,
            quantity: s.quantity,
            subtotal: calcSubtotalService(s.price, s.quantity),
          }))
        );
        if (e2) throw e2;
      }
      if (products.length > 0) {
        const { error: e3 } = await supabase.from("order_products").insert(
          products.map((p) => ({
            order_id: order.id,
            product_id: p.product_id ?? null,
            name: p.name,
            price: p.price,
            quantity: p.quantity,
            discount_pct: p.discount_pct,
            subtotal: calcSubtotalProduct(p.price, p.quantity, p.discount_pct),
          }))
        );
        if (e3) throw e3;
      }
      if (checklistId) {
        const cl: any = checklists.find((c: any) => c.id === checklistId);
        if (cl) {
          const { data: oc, error: e4 } = await supabase
            .from("order_checklists")
            .insert({ order_id: order.id, checklist_id: cl.id, name: cl.name })
            .select("id")
            .single();
          if (e4) throw e4;
          const items = (cl.checklist_items || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
          if (items.length > 0) {
            const { error: e5 } = await supabase.from("order_checklist_items").insert(
              items.map((it: any, idx: number) => ({
                order_checklist_id: oc.id,
                description: it.description,
                sort_order: idx,
              }))
            );
            if (e5) throw e5;
          }
        }
      }
      return order;
    },
    onSuccess: (order) => {
      toast.success(`OS #${order.order_number} criada!`);
      qc.invalidateQueries({ queryKey: ["orders"] });
      navigate(`/ordens/${order.id}`);
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao criar"),
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/ordens"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="text-xl font-bold">Nova {type === "quote" ? "Orçamento" : "O.S."}</h1>
      </div>

      <Card className="os-shadow-card">
        <CardContent className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="os">Ordem de Serviço</SelectItem>
                  <SelectItem value="quote">Orçamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label><User className="inline h-3 w-3 mr-1" />Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Manutenção elétrica residencial" />
          </div>
          <div className="space-y-2">
            <Label>Descrição do objeto</Label>
            <Textarea value={objectDescription} onChange={(e) => setObjectDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Wrench className="h-4 w-4 text-primary" /> Serviços</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Select value="" onValueChange={addService}>
            <SelectTrigger><SelectValue placeholder="+ Adicionar serviço" /></SelectTrigger>
            <SelectContent>
              {serviceCatalog.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name} — {fmtBRL(s.price)}</SelectItem>)}
            </SelectContent>
          </Select>
          {services.map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-md bg-muted/40">
              <div className="col-span-5"><Label className="text-xs">Nome</Label><Input value={s.name} onChange={(e) => setServices((p) => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} /></div>
              <div className="col-span-2"><Label className="text-xs">Qtd</Label><Input type="number" min="0" value={s.quantity} onChange={(e) => setServices((p) => p.map((x, j) => j === i ? { ...x, quantity: Number(e.target.value) } : x))} /></div>
              <div className="col-span-3"><Label className="text-xs">Preço</Label><Input type="number" step="0.01" value={s.price} onChange={(e) => setServices((p) => p.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))} /></div>
              <div className="col-span-1 text-right text-sm font-medium">{fmtBRL(calcSubtotalService(s.price, s.quantity))}</div>
              <div className="col-span-1"><Button variant="ghost" size="icon" onClick={() => setServices((p) => p.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Produtos</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Select value="" onValueChange={addProduct}>
            <SelectTrigger><SelectValue placeholder="+ Adicionar produto" /></SelectTrigger>
            <SelectContent>
              {productCatalog.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.name} — {fmtBRL(p.price)}</SelectItem>)}
            </SelectContent>
          </Select>
          {products.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-end p-3 rounded-md bg-muted/40">
              <div className="col-span-4"><Label className="text-xs">Nome</Label><Input value={p.name} onChange={(e) => setProducts((arr) => arr.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} /></div>
              <div className="col-span-2"><Label className="text-xs">Qtd</Label><Input type="number" min="0" value={p.quantity} onChange={(e) => setProducts((arr) => arr.map((x, j) => j === i ? { ...x, quantity: Number(e.target.value) } : x))} /></div>
              <div className="col-span-2"><Label className="text-xs">Preço</Label><Input type="number" step="0.01" value={p.price} onChange={(e) => setProducts((arr) => arr.map((x, j) => j === i ? { ...x, price: Number(e.target.value) } : x))} /></div>
              <div className="col-span-2"><Label className="text-xs">Desc %</Label><Input type="number" min="0" max="100" value={p.discount_pct} onChange={(e) => setProducts((arr) => arr.map((x, j) => j === i ? { ...x, discount_pct: Number(e.target.value) } : x))} /></div>
              <div className="col-span-1 text-right text-sm font-medium">{fmtBRL(calcSubtotalProduct(p.price, p.quantity, p.discount_pct))}</div>
              <div className="col-span-1"><Button variant="ghost" size="icon" onClick={() => setProducts((arr) => arr.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4 text-destructive" /></Button></div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><CheckSquare className="h-4 w-4 text-primary" /> Checklist</CardTitle></CardHeader>
        <CardContent>
          <Select value={checklistId || "none"} onValueChange={(v) => setChecklistId(v === "none" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="Anexar checklist (opcional)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {checklists.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Datas</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Data do Serviço</Label><Input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Data de Entrega</Label><Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4 text-primary" /> Observações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Observações do Cliente</Label><Textarea value={publicNotes} onChange={(e) => setPublicNotes(e.target.value)} /></div>
          <div className="space-y-2"><Label>Observações Internas</Label><Textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card className="os-shadow-card">
        <CardContent className="p-5 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal Serviços:</span><span>{fmtBRL(subtotalServices)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal Produtos:</span><span>{fmtBRL(subtotalProducts)}</span></div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Desconto:</span>
            <Input type="number" min="0" step="0.01" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-32 text-right" />
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-bold">Total Geral</span>
            <span className="font-bold text-xl text-primary">{fmtBRL(total)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="flex-1 os-gradient-primary border-0 h-12 text-base" disabled={createOrder.isPending} onClick={() => createOrder.mutate()}>
          {createOrder.isPending ? "Criando..." : `Criar ${type === "quote" ? "Orçamento" : "OS"}`}
        </Button>
        <Button variant="outline" className="h-12" asChild><Link to="/ordens">Cancelar</Link></Button>
      </div>
    </div>
  );
};

export default NewOrderPage;
