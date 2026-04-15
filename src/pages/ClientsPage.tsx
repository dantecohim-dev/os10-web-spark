import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Plus, Phone, Mail, User, Trash2, Pencil, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Client = Tables<"clients">;
type ClientAddress = Tables<"client_addresses">;

interface AddressForm {
  id?: string;
  label: string;
  zip: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
}

const emptyAddress = (): AddressForm => ({
  label: "Principal", zip: "", street: "", number: "", neighborhood: "", city: "", state: "", complement: "",
});

const ClientsPage = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const companyId = profile?.company_id;

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [notes, setNotes] = useState("");
  const [addresses, setAddresses] = useState<AddressForm[]>([emptyAddress()]);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients", companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").order("name");
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!companyId,
  });

  const { data: allAddresses = [] } = useQuery({
    queryKey: ["client_addresses", companyId],
    queryFn: async () => {
      const { data, error } = await supabase.from("client_addresses").select("*");
      if (error) throw error;
      return data as ClientAddress[];
    },
    enabled: !!companyId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    queryClient.invalidateQueries({ queryKey: ["client_addresses"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!companyId) throw new Error("Sem empresa");
      if (!name.trim() || !phone.trim()) throw new Error("Nome e telefone são obrigatórios");

      if (editingClient) {
        const { error } = await supabase.from("clients").update({
          name: name.trim(), phone: phone.trim(), email: email.trim() || null,
          identifier: identifier.trim() || null, notes: notes.trim() || null,
        }).eq("id", editingClient.id);
        if (error) throw error;

        // Delete old addresses, re-insert
        await supabase.from("client_addresses").delete().eq("client_id", editingClient.id);
        const validAddrs = addresses.filter(a => a.street.trim());
        if (validAddrs.length > 0) {
          const { error: ae } = await supabase.from("client_addresses").insert(
            validAddrs.map(a => ({ client_id: editingClient.id, label: a.label || "Principal", zip: a.zip || null, street: a.street || null, number: a.number || null, neighborhood: a.neighborhood || null, city: a.city || null, state: a.state || null, complement: a.complement || null }))
          );
          if (ae) throw ae;
        }
      } else {
        const { data: newClient, error } = await supabase.from("clients").insert({
          company_id: companyId, name: name.trim(), phone: phone.trim(),
          email: email.trim() || null, identifier: identifier.trim() || null, notes: notes.trim() || null,
        }).select("id").single();
        if (error) throw error;

        const validAddrs = addresses.filter(a => a.street.trim());
        if (validAddrs.length > 0) {
          const { error: ae } = await supabase.from("client_addresses").insert(
            validAddrs.map(a => ({ client_id: newClient.id, label: a.label || "Principal", zip: a.zip || null, street: a.street || null, number: a.number || null, neighborhood: a.neighborhood || null, city: a.city || null, state: a.state || null, complement: a.complement || null }))
          );
          if (ae) throw ae;
        }
      }
    },
    onSuccess: () => {
      toast.success(editingClient ? "Cliente atualizado!" : "Cliente cadastrado!");
      invalidate();
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Cliente excluído!"); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("clients").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); },
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingClient(null);
    setName(""); setPhone(""); setEmail(""); setIdentifier(""); setNotes("");
    setAddresses([emptyAddress()]);
  };

  const openEdit = (c: Client) => {
    setEditingClient(c);
    setName(c.name); setPhone(c.phone); setEmail(c.email || "");
    setIdentifier(c.identifier || ""); setNotes(c.notes || "");
    const cAddrs = allAddresses.filter(a => a.client_id === c.id);
    setAddresses(cAddrs.length > 0 ? cAddrs.map(a => ({
      id: a.id, label: a.label || "Principal", zip: a.zip || "", street: a.street || "",
      number: a.number || "", neighborhood: a.neighborhood || "", city: a.city || "",
      state: a.state || "", complement: a.complement || "",
    })) : [emptyAddress()]);
    setDialogOpen(true);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
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
          <Button className="os-gradient-primary border-0" onClick={() => { closeDialog(); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Novo Cliente
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Card key={i} className="os-shadow-card"><CardContent className="p-5 h-40 animate-pulse bg-muted/30" /></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="os-shadow-card"><CardContent className="p-8 text-center text-muted-foreground">
          {clients.length === 0 ? "Nenhum cliente cadastrado ainda." : "Nenhum resultado encontrado."}
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <Card key={client.id} className="os-shadow-card hover:os-shadow-elevated transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full os-gradient-primary flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground font-bold text-sm">{client.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{client.name}</p>
                      {client.identifier && <p className="text-xs text-muted-foreground">{client.identifier}</p>}
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`cursor-pointer ${client.active ? "bg-os-success/10 text-os-success" : "bg-muted text-muted-foreground"}`}
                    onClick={() => toggleActiveMutation.mutate({ id: client.id, active: !client.active })}
                  >
                    {client.active ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-2"><Phone className="h-3 w-3" />{client.phone}</div>
                  {client.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3" />{client.email}</div>}
                </div>
                <div className="pt-3 border-t flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(client)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(client.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label>Nome *</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
              <div><Label>Telefone *</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
              <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div><Label>CPF/CNPJ</Label><Input value={identifier} onChange={e => setIdentifier(e.target.value)} /></div>
            </div>
            <div><Label>Observações</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></div>

            {/* Addresses */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Endereços</Label>
                <Button variant="outline" size="sm" onClick={() => setAddresses([...addresses, emptyAddress()])}><Plus className="h-3 w-3 mr-1" />Adicionar</Button>
              </div>
              {addresses.map((addr, i) => (
                <Card key={i} className="p-3 space-y-2 relative">
                  {addresses.length > 1 && (
                    <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => setAddresses(addresses.filter((_, j) => j !== i))}><X className="h-3 w-3" /></Button>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    <div><Label className="text-xs">Rótulo</Label><Input className="h-8 text-sm" value={addr.label} onChange={e => { const a = [...addresses]; a[i] = { ...a[i], label: e.target.value }; setAddresses(a); }} /></div>
                    <div><Label className="text-xs">CEP</Label><Input className="h-8 text-sm" value={addr.zip} onChange={e => { const a = [...addresses]; a[i] = { ...a[i], zip: e.target.value }; setAddresses(a); }} /></div>
                    <div><Label className="text-xs">Estado</Label><Input className="h-8 text-sm" value={addr.state} onChange={e => { const a = [...addresses]; a[i] = { ...a[i], state: e.target.value }; setAddresses(a); }} /></div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2"><Label className="text-xs">Rua</Label><Input className="h-8 text-sm" value={addr.street} onChange={e => { const a = [...addresses]; a[i] = { ...a[i], street: e.target.value }; setAddresses(a); }} /></div>
                    <div><Label className="text-xs">Número</Label><Input className="h-8 text-sm" value={addr.number} onChange={e => { const a = [...addresses]; a[i] = { ...a[i], number: e.target.value }; setAddresses(a); }} /></div>
                    <div><Label className="text-xs">Bairro</Label><Input className="h-8 text-sm" value={addr.neighborhood} onChange={e => { const a = [...addresses]; a[i] = { ...a[i], neighborhood: e.target.value }; setAddresses(a); }} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Cidade</Label><Input className="h-8 text-sm" value={addr.city} onChange={e => { const a = [...addresses]; a[i] = { ...a[i], city: e.target.value }; setAddresses(a); }} /></div>
                    <div><Label className="text-xs">Complemento</Label><Input className="h-8 text-sm" value={addr.complement} onChange={e => { const a = [...addresses]; a[i] = { ...a[i], complement: e.target.value }; setAddresses(a); }} /></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
            <Button className="os-gradient-primary border-0" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { if (deleteId) deleteMutation.mutate(deleteId); setDeleteId(null); }}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;
