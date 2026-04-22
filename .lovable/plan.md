

## Plano: Fase 3 — Ordens de Serviço, Caixa Rápido e Configurações funcionais

A Fase 2 (cadastros básicos: Clientes, Produtos, Serviços, Checklists) já está conectada ao banco. Agora vamos conectar o restante do sistema operacional ao backend real, fechando o ciclo completo de uso do OS10.

---

### O que será construído

**1. Ordens de Serviço — Listagem (`OrdersPage.tsx`)**
- Listar OS e Orçamentos da empresa (tabela `orders`) com `client` via join
- Filtros por status (Aberta, Orçamento, Finalizada, Cancelada) e por tipo (OS / Orçamento)
- Busca por número da OS, nome do cliente ou título
- Cards/linhas com: número, cliente, título, status (badge), valor total, data
- Botão "Nova OS" e "Novo Orçamento"
- Click abre detalhe da OS

**2. Ordens de Serviço — Criação (`NewOrderPage.tsx`)**
- Formulário em etapas:
  - Tipo (OS ou Orçamento) + Cliente (autocomplete vinculado a `clients`) + endereço de atendimento
  - Título, descrição do objeto, datas de serviço/entrega
  - Adicionar serviços (busca em `services`, quantidade, preço editável) → grava em `order_services`
  - Adicionar produtos (busca em `products`, quantidade, desconto) → grava em `order_products`
  - Anexar checklist (escolher de `checklists`, copia itens para `order_checklists` + `order_checklist_items`)
  - Observações públicas e internas, desconto, repetição (dias)
- Cálculo automático de subtotal e total
- Salvar gera `order_number` automático e redireciona ao detalhe

**3. Ordens de Serviço — Detalhe (`OrderDetailPage.tsx`)**
- Carrega OS completa (orders + services + products + checklists + items + payments + photos + comments + signature)
- Abas: Resumo · Serviços/Produtos · Checklist · Fotos · Pagamentos · Comentários · Assinatura
- Mudar status (Orçamento → Aberta → Finalizada / Cancelada)
- Marcar itens do checklist como feitos (update em `order_checklist_items`)
- Upload de fotos (bucket `os-photos`) com estágio (antes/durante/depois)
- Registrar pagamentos (parcial/total, método) em `order_payments`
- Comentários internos e públicos em `order_comments`
- Assinatura digital (canvas) salva em `order_signatures`
- Ações: imprimir, exportar PDF, enviar por WhatsApp, duplicar

**4. Caixa Rápido (`QuickCheckoutPage.tsx`)**
- Já existe fluxo multi-step de UI; conectar ao banco
- Etapa Produtos: selecionar produtos de `products`, quantidade
- Etapa Resumo: total calculado, observações
- Etapa Pagamento: método (dinheiro/pix/cartão), confirmar
- Salvar grava em `quick_sales` + `quick_sale_items` e mostra recibo

**5. Dashboard (`Dashboard.tsx`)**
- Substituir mocks por dados reais:
  - OS abertas, finalizadas no mês, faturamento do mês (sum de `order_payments` + `quick_sales`)
  - Próximas OS agendadas (por `service_date`)
  - Repetições pendentes (`service_repeats` com `next_contact_date <= hoje`)
  - Top clientes do mês

**6. Configurações (`SettingsPage.tsx`)**
- Editar dados da empresa (nome, CNPJ/CPF, telefone, e-mail, endereço completo, logo, termo de responsabilidade) — update em `companies`
- Upload de logo no bucket `os-photos` (subpasta `logos/`)
- Visualizar plano atual (de `subscriptions`) e limites de uso

---

### Detalhes técnicos

- **React Query** (`useQuery` / `useMutation`) com `invalidateQueries` para tudo
- **Supabase Storage** para fotos da OS e logo (`os-photos`, já público)
- **Validação Zod** em todos os formulários (nome, valores, e-mail, telefone)
- **Multi-tenancy**: `company_id` vem do `useAuth()` e RLS já filtra
- **Cálculo de subtotal**: feito no client antes do insert (`price * quantity - discount`)
- **Sem migrações novas**: todas as tabelas já existem com RLS configurada
- **Formatação BRL** em todos os valores monetários
- **Toasts** (`sonner`) para feedback de sucesso/erro
- **Loading skeletons** durante fetches

---

### Arquivos

| Ação | Arquivo |
|------|---------|
| Reescrever | `src/pages/OrdersPage.tsx` |
| Reescrever | `src/pages/NewOrderPage.tsx` |
| Reescrever | `src/pages/OrderDetailPage.tsx` |
| Reescrever | `src/pages/QuickCheckoutPage.tsx` |
| Reescrever | `src/pages/Dashboard.tsx` |
| Reescrever | `src/pages/SettingsPage.tsx` |
| Criar | `src/lib/orders.ts` (helpers de cálculo e queries reutilizáveis) |
| Criar | `src/components/orders/OrderForm.tsx` (componente compartilhado novo/edição) |
| Criar | `src/components/orders/SignaturePad.tsx` |

---

### Fora do escopo desta fase

- Sistema de assinaturas/pagamento Premium (Fase 5)
- Relatórios avançados (Fase 5)
- Notificações WhatsApp/SMS, painel público do cliente, agenda de repetição com push (Fase 5)
- Usuários adicionais e perfis de permissão (Fase 5)

