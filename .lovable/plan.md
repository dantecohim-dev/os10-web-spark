

## Plano: Criar todos os CRUDs conectados ao banco de dados

Substituir os dados mock por dados reais do banco, com formulários completos de criação, edição e exclusão para Clientes, Produtos, Serviços e Checklists.

---

### O que será feito

**1. CRUD de Clientes (`ClientsPage.tsx`)**
- Listar clientes do banco (query `clients` filtrado por `company_id` via RLS)
- Dialog/modal para criar novo cliente: nome (obrigatório), telefone (obrigatório), email, identificador, observações
- Seção de endereços dentro do formulário (adicionar múltiplos endereços com CEP, rua, número, bairro, cidade, estado, complemento)
- Editar cliente existente (mesmo modal, preenchido)
- Botão ativar/inativar cliente
- Excluir cliente com confirmação
- Busca em tempo real por nome/email/telefone

**2. CRUD de Serviços (`ServicesPage.tsx`)**
- Listar serviços do banco (`services` table)
- Dialog para criar/editar: nome, preço, descrição, unidade de medida (select com opções: serviço, hora, m², unidade, diária, metro linear, etc.)
- Toggle ativo/inativo
- Excluir com confirmação
- Busca por nome

**3. CRUD de Produtos (`ProductsPage.tsx`)**
- Listar produtos do banco (`products` table)
- Dialog para criar/editar: nome, preço, descrição, estoque, desconto máximo (%), flag "cobrar na OS" (checkbox)
- Toggle ativo/inativo
- Excluir com confirmação
- Busca por nome

**4. CRUD de Checklists (nova página `ChecklistsPage.tsx`)**
- Nova rota `/checklists` no App.tsx
- Listar checklists da empresa
- Dialog para criar/editar: nome do checklist + lista de itens (adicionar/remover/reordenar itens)
- Excluir checklist com confirmação

---

### Detalhes Técnicos

- Usar `@tanstack/react-query` para fetch/cache (`useQuery`, `useMutation`, `queryClient.invalidateQueries`)
- Usar `useAuth()` para obter `profile.company_id` ao inserir registros
- Componente `Dialog` do shadcn/ui para os formulários modais
- `AlertDialog` para confirmação de exclusão
- `toast` do sonner para feedback de sucesso/erro
- Formatação de moeda brasileira (R$) nos campos de preço
- Todos os formulários com validação client-side antes de enviar
- Não precisa de migração -- todas as tabelas já existem no banco

---

### Arquivos

| Ação | Arquivo |
|------|---------|
| Reescrever | `src/pages/ClientsPage.tsx` |
| Reescrever | `src/pages/ProductsPage.tsx` |
| Reescrever | `src/pages/ServicesPage.tsx` |
| Criar | `src/pages/ChecklistsPage.tsx` |
| Editar | `src/App.tsx` (adicionar rota `/checklists`) |
| Editar | `src/components/AppSidebar.tsx` (adicionar link Checklists no menu) |

