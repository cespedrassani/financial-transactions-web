# Sistema de Transações Financeiras - Frontend

Aplicação frontend para gerenciamento de transações financeiras, desenvolvida como parte de um desafio técnico para módulo de processamento de eventos financeiros.

## Visão Geral

Interface web moderna para gerenciamento de transações financeiras com foco em:
- **Usabilidade**: Interface intuitiva com feedback visual em todas as ações
- **Confiabilidade**: Validações robustas e tratamento de erros amigável
- **Manutenibilidade**: Código organizado em arquitetura modular
- **Testabilidade**: Cobertura de testes E2E nos fluxos principais

## Stack Tecnológico

- **React 19** com TypeScript
- **Next.js 16** (App Router)
- **Tailwind CSS** para estilização
- **Axios** para comunicação HTTP
- **Cypress** para testes E2E

## Estrutura do Projeto

```
src/
├── app/                      # Páginas Next.js (App Router)
│   ├── layout.tsx            # Layout principal da aplicação
│   ├── page.tsx              # Página principal
│   └── globals.css           # Estilos globais
├── components/               # Componentes React reutilizáveis
│   └── ui/
│       ├── Toast.tsx         # Sistema de notificações
│       ├── ConfirmDialog.tsx # Modal de confirmação
│       └── Pagination.tsx    # Componente de paginação
├── features/                 # Módulos de funcionalidades
│   └── transactions/
│       ├── index.tsx         # Container principal
│       └── components/
│           ├── form.tsx      # Formulário de criação
│           ├── list.tsx      # Lista de transações
│           └── filters.tsx   # Filtros de busca
├── hooks/                    # Custom hooks React
│   └── useTransactions.ts    # Hook de gerenciamento de transações
├── services/                 # Camada de comunicação HTTP
│   └── transaction.service.ts
├── lib/                      # Utilitários e configurações
│   ├── api.ts                # Configuração do Axios
│   └── utils.ts              # Funções utilitárias
└── types/                    # Definições TypeScript
    └── transaction.ts        # Interfaces de transação

cypress/
├── e2e/                      # Testes end-to-end
│   └── transactions/
│       ├── create.cy.ts      # Testes de criação
│       ├── list.cy.ts        # Testes de listagem e filtros
│       ├── delete.cy.ts      # Testes de exclusão
│       └── pagination.cy.ts  # Testes de paginação
└── support/
    ├── commands.ts           # Comandos customizados e mocks
    └── e2e.ts                # Configuração global dos testes
```

## Funcionalidades

### Implementadas
- Listagem de transações com paginação
- Criação de novas transações com validação
- Exclusão de transações com confirmação
- Filtros por status (pendente, concluída, falhou) e tipo (crédito, débito)
- Sistema de notificações (toasts) para feedback de ações
- Loading states em todas as operações assíncronas
- Tratamento de erros com mensagens amigáveis

### Validações do Formulário
- Valor obrigatório e maior que zero
- Valor máximo de R$ 1.000.000,00
- Descrição com 3-200 caracteres
- Tipo de transação obrigatório

## Arquitetura & Decisões Técnicas

### Por que essa organização?

**Feature-based Architecture**
- **features/**: Cada funcionalidade é isolada em seu próprio módulo, facilitando manutenção e escalabilidade
- **components/ui/**: Componentes genéricos reutilizáveis em toda a aplicação
- **hooks/**: Custom hooks encapsulam lógica de estado e efeitos, separando da UI
- **services/**: Isola lógica HTTP dos componentes, facilita mocking em testes
- **types/**: Contratos TypeScript garantem type safety

**Benefícios:**
- **Testabilidade**: Cada camada pode ser testada isoladamente com mocks
- **Manutenibilidade**: Mudanças em uma camada não afetam outras
- **Escalabilidade**: Novas features podem ser adicionadas sem afetar as existentes

### Dívida Técnica Consciente

**a) Testes Unitários**
- Atual: Apenas testes E2E com Cypress
- Futuro: Adicionar Jest + React Testing Library para testes de componentes e hooks

**b) Acessibilidade (a11y)**
- Atual: Estrutura semântica básica
- Futuro: Auditoria completa com axe-core, suporte a leitores de tela

**c) Internacionalização (i18n)**
- Atual: Textos hardcoded em português
- Futuro: next-intl ou react-i18next para suporte multi-idioma

**d) Estado Global**
- Atual: Estado local com hooks
- Futuro: Zustand ou Context API se a complexidade aumentar

## Como Rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Rodar em desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Scripts Disponíveis
```bash
npm run dev       # Inicia servidor de desenvolvimento
npm run build     # Gera build de produção
npm run start     # Inicia servidor de produção
npm run lint      # Executa linter
npm run cy:open   # Abre o Cypress (modo interativo)
npm run cy:run    # Roda os testes no terminal
npm run test:e2e  # Inicia dev server + roda testes (ideal para CI)
```

### Variáveis de Ambiente
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Testes

O projeto usa **Cypress** para testes end-to-end. Os testes simulam a interação real do usuário com a aplicação, validando os principais fluxos.

### Rodando os testes

```bash
# Modo interativo (abre o Cypress com interface visual)
npm run dev          # Em um terminal
npm run cy:open      # Em outro terminal

# Modo headless (roda no terminal, ideal para CI)
npm run cy:run

# Modo completo (inicia servidor + roda testes)
npm run test:e2e
```

### O que é testado

Os testes cobrem os fluxos principais da aplicação:

**Criar transação** (`cypress/e2e/transactions/create.cy.ts`)
- Validação de valor (maior que zero, limite máximo)
- Validação de descrição (mínimo de caracteres)
- Criação com sucesso e feedback visual
- Estado de loading durante processamento

**Listar transações** (`cypress/e2e/transactions/list.cy.ts`)
- Exibição da lista com dados formatados
- Estados de loading e lista vazia
- Filtros por status e tipo
- Botão de limpar filtros

**Deletar transação** (`cypress/e2e/transactions/delete.cy.ts`)
- Modal de confirmação antes de excluir
- Cancelamento da exclusão
- Exclusão com sucesso
- Tratamento de erro

**Paginação** (`cypress/e2e/transactions/pagination.cy.ts`)
- Navegação entre páginas
- Botões anterior/próximo
- Reset de página ao filtrar

### Estratégia de Mocks

Os testes usam `cy.intercept()` para simular as respostas da API:

- **Testes rápidos**: Não dependem de rede ou banco de dados
- **Testes estáveis**: Sempre retornam os mesmos dados
- **Fácil simular erros**: Permite testar cenários de falha

Os mocks ficam em `cypress/support/commands.ts` e podem ser customizados em cada teste.
