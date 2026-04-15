import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ClipboardCheck, Search, Plus, Trash2, Pencil, GripVertical, X } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Checklist = Tables<"checklists">;
type ChecklistItem = Tables<"checklist_items">;

const ChecklistsPage = () => {
  const { profile } = useAuth();
  const qc = useQueryClient();
  const companyId = profile?.company_id;

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Checklist | null>(null);

  const [name, setName] = useState("");
  const [items, setItems] = useState<string[]>([""]);

  const { data: checklists = [], isLoading } = useQuery({
    queryKey: ["checklists", companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("checklists").select("*").order("name");
      if (error) throw error;
      return data as Checklist[];
    },
    enabled: !!companyId,
  });

  const { data: allItems = [] } = useQuery({
    queryKey: ["checklist_items", companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("checklist_items").select("*").order("sort_order");
      if (error) throw error;
      return data as ChecklistItem[];
    },
    enabled: !!companyId,
  });

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["checklists"] }); qc.invalidateQueries({ queryKey: ["checklist_items"] }); };

  const closeDialog = () => { setDialogOpen(false); setEditing(null); setName(""); setItems([""]); };

  const openEdit = (c: Checklist) => {
    setEditing(c); setName(c.name);
    const cItems = allItems.filter(i => i.checklist_id === c.id).sort((a, b) => a.sort_order - b.sort_order);
    setItems(cItems.length > 0 ? cItems.map(i => i.description) : [""]);
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error("Sem empresa");
      if (!name.trim()) throw new Error("Nome é obrigatório");
      const validItems = items.filter(i => i.trim());

      if (editing) {
        const { error } = await supabase.from("checklists").update({ name: name.trim() }).eq("id", editing.id);
        if (error) throw error;
        await supabase.from("checklist_items").delete().eq("checklist_id", editing.id);
        if (validItems.length > 0) {
          const { error: ie } = await supabase.from("checklist_items").insert(
            validItems.map((desc, i) => ({ checklist_id: editing.id, description: desc.trim(), sort_order: i }))
          );
          if (ie) throw ie;
        }
      } else {
        const { data: newCl, error } = await supabase.from("checklists").insert({ company_id: companyId, name: name.trim() }).select("id").single();
        if (error) throw error;
        if (validItems.length > 0) {
          const { error: ie } = await supabase.from("checklist_items").insert(
            validItems.map((desc, i) => ({ checklist_id: newCl.id, description: desc.trim(), sort_order: i }))
          );
          if (ie) throw ie;
        }
      }
    },
    onSuccess: () => { toast.success(editing ? "Checklist atualizado!" : "Checklist criado!"); invalidate(); closeDialog(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("checklist_items").delete().eq("checklist_id", id);
      const { error } = await supabase.from("checklists").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Checklist excluído!"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const filtered = checklists.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4 animate-fade-in max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Checklists</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar checklists..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-60" />
          </div>
          <Button className="os-gradient-primary border-0" onClick={() => { closeDialog(); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Novo Checklist</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <Card key={i} className="os-shadow-card"><CardContent className="p-5 h-32 animate-pulse bg-muted/30" /></Card>)}</div>
      ) : filtered.length === 0 ? (
        <Card className="os-shadow-card"><CardContent className="p-8 text-center text-muted-foreground">{checklists.length === 0 ? "Nenhum checklist cadastrado." : "Nenhum resultado."}</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => {
            const count = allItems.filter(i => i.checklist_id === c.id).length;
            return (
              <Card key={c.id} className="os-shadow-card hover:os-shadow-elevated transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><ClipboardCheck className="h-5 w-5" /></div>
                  </div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{count} {count === 1 ? "item" : "itens"}</p>
                  <div className="pt-3 border-t flex justify-end gap-1 mt-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={o => { if (!o) closeDialog(); }}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Editar Checklist" : "Novo Checklist"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome *</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Itens do Checklist</Label>
                <Button variant="outline" size="sm" onClick={() => setItems([...items, ""])}><Plus className="h-3 w-3 mr-1" />Adicionar</Button>
              </div>
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Input value={item} onChange={e => { const a = [...items]; a[i] = e.target.value; setItems(a); }} placeholder={`Item ${i + 1}`} className="h-8 text-sm" />
                  {items.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setItems(items.filter((_, j) => j !== i))}><X className="h-3 w-3" /></Button>
                  )}
                </div>
              ))}
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
          <AlertDialogHeader><AlertDialogTitle>Excluir checklist?</AlertDialogTitle><AlertDialogDescription>Esta ação e todos os itens serão excluídos permanentemente.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { if (deleteId) deleteMutation.mutate(deleteId); setDeleteId(null); }}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChecklistsPage;
