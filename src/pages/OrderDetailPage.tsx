import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Camera, Trash2, FileSignature, Printer } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { fmtBRL, fmtDate, fmtDateTime, ORDER_STATUSES, PAYMENT_METHODS, statusClass, statusLabel } from "@/lib/orders";
import { SignaturePad } from "@/components/orders/SignaturePad";

const OrderDetailPage = () => {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          client:clients(id, name, phone, email),
          order_services(*),
          order_products(*),
          order_checklists(*, order_checklist_items(*)),
          order_payments(*),
          order_photos(*),
          order_comments(*),
          order_signatures(*)
        `)
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["order", id] });

  const setStatus = useMutation({
    mutationFn: async (status: string) => {
      const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Status atualizado"); invalidate(); qc.invalidateQueries({ queryKey: ["orders"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleChecklistItem = useMutation({
    mutationFn: async ({ itemId, checked }: { itemId: string; checked: boolean }) => {
      const { error } = await supabase.from("order_checklist_items").update({ checked }).eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  // Comments
  const [commentText, setCommentText] = useState("");
  const [commentInternal, setCommentInternal] = useState(false);
  const addComment = useMutation({
    mutationFn: async () => {
      if (!commentText.trim()) throw new Error("Vazio");
      const { error } = await supabase.from("order_comments").insert({
        order_id: id!, content: commentText.trim(), is_internal: commentInternal,
      });
      if (error) throw error;
    },
    onSuccess: () => { setCommentText(""); toast.success("Comentário adicionado"); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  // Payment
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Dinheiro");
  const addPayment = useMutation({
    mutationFn: async () => {
      const amt = Number(payAmount);
      if (!amt || amt <= 0) throw new Error("Valor inválido");
      const { error } = await supabase.from("order_payments").insert({
        order_id: id!, amount: amt, method: payMethod,
      });
      if (error) throw error;
    },
    onSuccess: () => { setPayAmount(""); toast.success("Pagamento registrado"); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  // Photo upload
  const [photoStage, setPhotoStage] = useState("during");
  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      const ext = file.name.split(".").pop();
      const path = `orders/${id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("os-photos").upload(path, file);
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("os-photos").getPublicUrl(path);
      const { error } = await supabase.from("order_photos").insert({
        order_id: id!, photo_url: urlData.publicUrl, stage: photoStage,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Foto enviada"); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  // Signature
  const saveSignature = useMutation({
    mutationFn: async (data: string) => {
      // delete existing then insert (1:1)
      await supabase.from("order_signatures").delete().eq("order_id", id!);
      const { error } = await supabase.from("order_signatures").insert({
        order_id: id!, signature_data: data, signer_name: order?.client?.name ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Assinatura salva"); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteOrder = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("orders").delete().eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("OS excluída"); qc.invalidateQueries({ queryKey: ["orders"] }); navigate("/ordens"); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="space-y-3 max-w-4xl"><Skeleton className="h-12 w-1/2" /><Skeleton className="h-64" /></div>;
  if (!order) return <div className="max-w-4xl text-center py-12 text-muted-foreground">OS não encontrada.</div>;

  const totalPaid = (order.order_payments ?? []).reduce((s: number, p: any) => s + Number(p.amount), 0);
  const remaining = Number(order.total ?? 0) - totalPaid;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/ordens"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">OS #{order.order_number}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusClass(order.status)}>{statusLabel(order.status)}</Badge>
              {order.type === "quote" && <Badge variant="outline">Orçamento</Badge>}
              <span className="text-sm text-muted-foreground">Criada em {fmtDate(order.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={order.status} onValueChange={(v) => setStatus.mutate(v)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => window.print()}><Printer className="h-4 w-4" /></Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir OS?</AlertDialogTitle>
                <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteOrder.mutate()}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="resumo">
        <TabsList className="bg-muted flex-wrap">
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="itens">Itens</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="fotos">Fotos</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="comentarios">Comentários</TabsTrigger>
          <TabsTrigger value="assinatura">Assinatura</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-4 space-y-4">
          <Card className="os-shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Cliente</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-semibold">{order.client?.name ?? "—"}</p>
              <p className="text-muted-foreground">{order.client?.phone}</p>
              <p className="text-muted-foreground">{order.client?.email}</p>
            </CardContent>
          </Card>
          <Card className="os-shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Detalhes</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Título:</span> {order.title ?? "—"}</div>
              <div><span className="text-muted-foreground">Total:</span> <span className="font-bold text-primary">{fmtBRL(order.total)}</span></div>
              <div><span className="text-muted-foreground">Serviço:</span> {fmtDate(order.service_date)}</div>
              <div><span className="text-muted-foreground">Entrega:</span> {fmtDate(order.delivery_date)}</div>
              {order.object_description && <div className="col-span-2"><span className="text-muted-foreground">Descrição:</span> {order.object_description}</div>}
              {order.public_notes && <div className="col-span-2"><span className="text-muted-foreground">Obs cliente:</span> {order.public_notes}</div>}
              {order.internal_notes && <div className="col-span-2"><span className="text-muted-foreground">Obs internas:</span> {order.internal_notes}</div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itens" className="mt-4 space-y-4">
          <Card className="os-shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Serviços</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(order.order_services ?? []).length === 0 ? <p className="text-sm text-muted-foreground">Nenhum serviço.</p> :
                order.order_services.map((s: any) => (
                  <div key={s.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                    <div><p className="font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.quantity} × {fmtBRL(s.price)}</p></div>
                    <span className="font-semibold">{fmtBRL(s.subtotal)}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
          <Card className="os-shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Produtos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {(order.order_products ?? []).length === 0 ? <p className="text-sm text-muted-foreground">Nenhum produto.</p> :
                order.order_products.map((p: any) => (
                  <div key={p.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                    <div><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.quantity} × {fmtBRL(p.price)} {p.discount_pct ? `(-${p.discount_pct}%)` : ""}</p></div>
                    <span className="font-semibold">{fmtBRL(p.subtotal)}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="mt-4 space-y-3">
          {(order.order_checklists ?? []).length === 0 ? (
            <Card><CardContent className="py-6 text-center text-muted-foreground text-sm">Sem checklist.</CardContent></Card>
          ) : order.order_checklists.map((cl: any) => (
            <Card key={cl.id} className="os-shadow-card">
              <CardHeader className="pb-3"><CardTitle className="text-base">{cl.name}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {(cl.order_checklist_items ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((it: any) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <Checkbox checked={it.checked} onCheckedChange={(v) => toggleChecklistItem.mutate({ itemId: it.id, checked: !!v })} />
                    <Label className={`text-sm font-normal ${it.checked ? "line-through text-muted-foreground" : ""}`}>{it.description}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="fotos" className="mt-4 space-y-4">
          <Card className="os-shadow-card">
            <CardContent className="p-4 flex items-center gap-3">
              <Select value={photoStage} onValueChange={setPhotoStage}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Antes</SelectItem>
                  <SelectItem value="during">Durante</SelectItem>
                  <SelectItem value="after">Depois</SelectItem>
                </SelectContent>
              </Select>
              <Label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground">
                <Camera className="h-4 w-4" /> Anexar foto
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto.mutate(e.target.files[0])} />
              </Label>
              {uploadPhoto.isPending && <span className="text-sm text-muted-foreground">Enviando...</span>}
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(order.order_photos ?? []).map((ph: any) => (
              <a key={ph.id} href={ph.photo_url} target="_blank" rel="noreferrer" className="group">
                <img src={ph.photo_url} alt={ph.stage} className="w-full aspect-square object-cover rounded-md border" />
                <p className="text-xs text-muted-foreground mt-1">{ph.stage}</p>
              </a>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pagamentos" className="mt-4 space-y-4">
          <Card className="os-shadow-card">
            <CardContent className="p-5 grid grid-cols-3 gap-4 text-sm">
              <div><span className="text-muted-foreground block">Total OS</span><span className="font-bold">{fmtBRL(order.total)}</span></div>
              <div><span className="text-muted-foreground block">Pago</span><span className="font-bold text-os-success">{fmtBRL(totalPaid)}</span></div>
              <div><span className="text-muted-foreground block">Restante</span><span className="font-bold text-destructive">{fmtBRL(remaining)}</span></div>
            </CardContent>
          </Card>
          <Card className="os-shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base">Registrar pagamento</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1"><Label>Valor</Label><Input type="number" step="0.01" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} /></div>
              <div className="space-y-1"><Label>Método</Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PAYMENT_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end"><Button className="os-gradient-primary border-0 w-full" onClick={() => addPayment.mutate()} disabled={addPayment.isPending}>Adicionar</Button></div>
            </CardContent>
          </Card>
          <Card className="os-shadow-card">
            <CardContent className="p-4 space-y-2">
              {(order.order_payments ?? []).length === 0 ? <p className="text-sm text-muted-foreground">Sem pagamentos.</p> :
                order.order_payments.map((p: any) => (
                  <div key={p.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                    <div><p className="font-medium">{p.method}</p><p className="text-xs text-muted-foreground">{fmtDateTime(p.paid_at)}</p></div>
                    <span className="font-semibold">{fmtBRL(p.amount)}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comentarios" className="mt-4 space-y-4">
          <Card className="os-shadow-card">
            <CardContent className="p-4 space-y-3">
              <Textarea placeholder="Escreva um comentário..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={commentInternal} onCheckedChange={(v) => setCommentInternal(!!v)} /> Interno (não visível ao cliente)
                </label>
                <Button onClick={() => addComment.mutate()} disabled={addComment.isPending} className="os-gradient-primary border-0">Comentar</Button>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {(order.order_comments ?? []).map((c: any) => (
              <Card key={c.id} className="os-shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">{fmtDateTime(c.created_at)}</span>
                    {c.is_internal && <Badge variant="outline" className="text-xs">Interno</Badge>}
                  </div>
                  <p className="text-sm">{c.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assinatura" className="mt-4 space-y-3">
          <Card className="os-shadow-card">
            <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileSignature className="h-4 w-4 text-primary" /> Assinatura do Cliente</CardTitle></CardHeader>
            <CardContent>
              <SignaturePad initial={order.order_signatures?.[0]?.signature_data ?? null} onSave={(d) => saveSignature.mutate(d)} />
              {order.order_signatures?.[0] && <p className="text-xs text-muted-foreground mt-2">Assinada em {fmtDateTime(order.order_signatures[0].signed_at)}</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderDetailPage;
