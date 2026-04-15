

## Plano: WebApp OS10 100% Funcional

Baseado no documento completo de funcionalidades do OS10 mobile, nas suas respostas sobre Premium vs Gratuito, e nos recursos extras aprovados.

---

### Arquitetura Geral

**Backend**: Lovable Cloud (Supabase) — banco de dados, autenticação, Edge Functions
**Frontend**: React + Tailwind (já existente) — será conectado ao backend real
**Pagamentos da assinatura**: Lovable Payments (Stripe ou Paddle) para cobrar a assinatura Premium

---

### Banco de Dados — Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `companies` | Dados da empresa (CNPJ, logo, endereço, termo de responsabilidade) |
| `user_roles` | Perfis de permissão (admin, técnico, atendente, etc.) |
| `company_users` | Funcionários/usuários adicionais vinculados à empresa |
| `clients` | Clientes com múltiplos endereços e contratos |
| `client_addresses` | Endereços dos clientes (1:N) |
| `client_contracts` | Contratos vinculados aos clientes |
| `services` | Serviços com unidade de medida e tabela de preços |
| `service_price_table` | Variações de preço por serviço |
| `products` | Produtos com desconto máximo e flag "cobrar na OS" |
| `checklists` | Templates de checklist |
| `checklist_items` | Itens de cada checklist |
| `orders` | Ordens de serviço / orçamentos |
| `order_services` | Serviços vinculados à OS (com repetição) |
| `order_products` | Produtos vinculados à OS |
| `order_checklists` | Checklists aplicadas na OS |
| `order_checklist_items` | Status de cada item do checklist na OS |
| `order_photos` | Fotos anexadas à OS |
| `order_comments` | Observações públicas e comentários internos |
| `order_payments` | Pagamentos recebidos (forma, valor, recibo) |
| `order_signatures` | Assinatura digital do cliente |
| `order_locations` | Localização GPS salva pelo técnico |
| `service_repeats` | Repetições agendadas de serviços |
| `quick_sales` | Vendas do caixa rápido |
| `quick_sale_items` | Itens de cada venda rápida |
| `subscriptions` | Controle da assinatura (gratuito/premium) da empresa |

---

### Módulos a Implementar

**1. Autenticação e Multi-empresa**
- Login com email/senha, cadastro de nova empresa
- Cada empresa isolada (RLS por company_id)
- Perfis de permissão configuráveis pelo admin

**2. CRUD de Clientes**
- Campos: identificador, nome (obrigatório), telefone (obrigatório), email, múltiplos endereços, contratos
- Busca, filtro, ativo/inativo

**3. CRUD de Serviços**
- Nome, preço, unidade de medida (m², hora, unidade, etc.)
- Tabela de preços (variações do mesmo serviço)
- Ativo/inativo
- Cálculo automático: preço × quantidade

**4. CRUD de Produtos**
- Similar a serviços + desconto máximo (%) + flag "cobrar na OS ou só controle interno"

**5. CRUD de Ordens de Serviço / Orçamentos**
- Criar como OS ou Orçamento (converter depois)
- Adicionar: cliente, serviços (com checklist), produtos, objeto do serviço
- Observações públicas + comentários internos
- Data do serviço + data de entrega
- Repetição de serviço (X dias para recontactar)
- Fluxo de status: Orçamento → Autorizada → Em Andamento → Finalizada → Perdida

**6. Detalhes da OS**
- Todas as informações em tela (cliente, valor, datas, endereço, status, saldo)
- Botões: Editar, Enviar PDF, Anexar Foto, Autorizar, Em Andamento, Finalizar, Perdida
- Ver OS (visualização formatada), Assinar OS (assinatura digital na tela)
- Salvar Localização GPS, Pagamento (forma + valor + recibo), Excluir
- Checklist interativa

**7. Calendário de Serviços**
- Visualização dia/semana/mês com OSs agendadas
- Notificação de repetição de serviço (alerta quando chegar a data)

**8. Caixa Rápido (PDV)**
- Já existe a interface — conectar ao banco
- Registro de vendas com formas de pagamento
- Histórico de vendas

**9. Relatórios (Premium)**
- Listagem de OS com filtros (data, status, usuário, cliente, serviço)
- Gráfico de vendas, ticket médio, ranking de serviços e produtos
- Download PDF

**10. Configurações**
- Dados da empresa (CNPJ, logo, endereço)
- Checklists (CRUD de templates)
- Termo de responsabilidade
- Perfis de permissão
- Usuários adicionais/funcionários

**11. Vídeos Tutoriais**
- Página com vídeos explicativos de uso do sistema

---

### Modelo Freemium

| Funcionalidade | Gratuito | Premium |
|----------------|----------|---------|
| Criar O.S. | Até 15/mês | Ilimitado |
| Clientes/Serviços/Produtos | CRUD completo | CRUD completo |
| Usuários adicionais | Apenas o admin | Ilimitado |
| Relatórios e gráficos | Apenas dashboard básico | Completo com filtros e export |
| Envio de PDF da OS | Não | Sim |
| Assinatura digital | Não | Sim |
| Caixa Rápido | Até 10 vendas/mês | Ilimitado |
| Calendário | Visualização básica | Completo com notificações |
| Checklists | Até 3 templates | Ilimitado |
| Notificações WhatsApp/SMS | Não | Sim |
| Painel do cliente (link público) | Não | Sim |
| Agenda com notificação de repetição | Não | Sim |
| Perfis de permissão | Não | Sim |

---

### Recursos Extras (aprovados)

1. **Notificações WhatsApp/SMS** — Edge Function com Twilio (conector disponível) para enviar status da OS ao cliente
2. **Painel do cliente (link público)** — Página pública onde o cliente acompanha status da OS em tempo real via link único
3. **Agenda com notificação de repetição** — Sistema de alertas para serviços recorrentes, lembrando o prestador de recontactar o cliente

---

### Sequência de Implementação

Dado o tamanho do projeto, será feito em fases:

**Fase 1 — Base (autenticação + estrutura)**
- Ativar Lovable Cloud, criar schema do banco
- Autenticação (login/cadastro), RLS, multi-empresa
- Cadastro da empresa

**Fase 2 — CRUDs fundamentais**
- Clientes (com endereços e contratos)
- Serviços (com tabela de preços e unidades)
- Produtos
- Checklists

**Fase 3 — Ordens de Serviço**
- CRUD completo de OS/Orçamento
- Todos os botões de ação (status, pagamento, fotos, assinatura, GPS)
- Geração de PDF da OS

**Fase 4 — Calendário e Caixa Rápido**
- Calendário com OSs agendadas
- Caixa Rápido conectado ao banco

**Fase 5 — Premium e extras**
- Sistema de assinatura (Lovable Payments)
- Limites por plano (gate no frontend + backend)
- Relatórios completos com filtros e export
- Perfis de permissão e usuários adicionais
- Notificações WhatsApp/SMS
- Painel público do cliente
- Repetição com notificação

**Fase 6 — Polish**
- Vídeos tutoriais
- Testes end-to-end

---

### Pré-requisito

O **Lovable Cloud** precisa estar habilitado no projeto antes de começar a Fase 1. Posso começar pela Fase 1 assim que aprovar o plano.

