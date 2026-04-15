import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Package, Search, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const formatBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ProductsPage = () => {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const companyId = profile?.company_id;

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [chargeOnOs, setChargeOnOs] = useState(true);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!companyId,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["products"] });

  const closeDialog = () => {
    setDialogOpen(false); setEditing(null);
    setName(""); setPrice(""); setDescription(""); setStock(""); setMaxDiscount(""); setChargeOnOs(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p); setName(p.name); setPrice(String(p.price)); setDescription(p.description || "");
    setStock(String(p.stock)); setMaxDiscount(String(p.max_discount || 0)); setChargeOnOs(p.charge_on_os);
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error("Sem empresa");
      if (!name.trim()) throw new Error("Nome é obrigatório");
      const payload = {
        name: name.trim(), price: parseFloat(price) || 0, description: description.trim() || null,
        stock: parseInt(stock) || 0, max_discount: parseFloat(maxDiscount) || 0, charge_on_os: chargeOnOs,
      };
      if (editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert({ ...payload, company_id: companyId });
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success(editing ? "Produto atualizado!" : "Produto cadastrado!"); invalidate(); closeDialog(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Produto excluído!"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("products").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

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
          <Button className="os-gradient-primary border-0" onClick={() => { closeDialog(); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Novo Produto</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <Card key={i} className="os-shadow-card"><CardContent className="p-5 h-36 animate-pulse bg-muted/30" /></Card>)}</div>
      ) : filtered.length === 0 ? (
        <Card className="os-shadow-card"><CardContent className="p-8 text-center text-muted-foreground">{products.length === 0 ? "Nenhum produto cadastrado." : "Nenhum resultado."}</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="os-shadow-card hover:os-shadow-elevated transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Package className="h-5 w-5" /></div>
                  <Badge variant="secondary" className={`cursor-pointer ${p.active ? "bg-os-success/10 text-os-success" : "bg-muted text-muted-foreground"}`} onClick={() => toggleActive.mutate({ id: p.id, active: !p.active })}>
                    {p.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-lg font-bold text-primary mt-1">{formatBRL(p.price)}</p>
                <p className="text-xs text-muted-foreground mt-2">Estoque: {p.stock} | Desc. máx: {p.max_discount}%</p>
                <div className="pt-3 border-t flex justify-end gap-1 mt-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={o => { if (!o) closeDialog(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Editar Produto" : "Novo Produto"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Nome *</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} /></div>
              <div><Label>Estoque</Label><Input type="number" value={stock} onChange={e => setStock(e.target.value)} /></div>
            </div>
            <div><Label>Desconto máximo (%)</Label><Input type="number" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} /></div>
            <div><Label>Descrição</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} /></div>
            <div className="flex items-center gap-2">
              <Checkbox id="charge" checked={chargeOnOs} onCheckedChange={v => setChargeOnOs(!!v)} />
              <Label htmlFor="charge" className="text-sm">Cobrar na O.S.</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button className="os-gradient-primary border-0" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>{saveMutation.isPending ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Excluir produto?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { if (deleteId) deleteMutation.mutate(deleteId); setDeleteId(null); }}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsPage;
