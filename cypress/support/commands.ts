/// <reference types="cypress" />

// Custom commands para facilitar os testes

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Intercepta a API e retorna uma lista de transações mockadas
       */
      mockTransactions(transactions?: TransactionMock[]): Chainable<void>;

      /**
       * Intercepta a criação de transação
       */
      mockCreateTransaction(response?: Partial<TransactionMock>): Chainable<void>;

      /**
       * Intercepta a deleção de transação
       */
      mockDeleteTransaction(): Chainable<void>;
    }
  }
}

export interface TransactionMock {
  id: string;
  externalId: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'credit' | 'debit';
  createdAt: string;
}

export const mockTransactionsList: TransactionMock[] = [
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    externalId: 'ext-001',
    amount: 1500.00,
    description: 'Pagamento de fornecedor',
    status: 'completed',
    type: 'debit',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
    externalId: 'ext-002',
    amount: 3200.50,
    description: 'Recebimento de cliente',
    status: 'completed',
    type: 'credit',
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
    externalId: 'ext-003',
    amount: 750.00,
    description: 'Taxa de serviço',
    status: 'pending',
    type: 'debit',
    createdAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
    externalId: 'ext-004',
    amount: 500.00,
    description: 'Transferência rejeitada',
    status: 'failed',
    type: 'debit',
    createdAt: '2024-01-12T16:45:00Z',
  },
];

Cypress.Commands.add('mockTransactions', (transactions = mockTransactionsList) => {
  cy.intercept('GET', '**/transactions*', {
    statusCode: 200,
    body: {
      data: transactions,
      meta: {
        total: transactions.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(transactions.length / 10),
      },
    },
  }).as('getTransactions');
});

Cypress.Commands.add('mockCreateTransaction', (response = {}) => {
  const newTransaction: TransactionMock = {
    id: 'new-transaction-id',
    externalId: 'ext-new',
    amount: 100,
    description: 'Nova transação',
    status: 'pending',
    type: 'debit',
    createdAt: new Date().toISOString(),
    ...response,
  };

  cy.intercept('POST', '**/transactions', {
    statusCode: 201,
    body: newTransaction,
  }).as('createTransaction');
});

Cypress.Commands.add('mockDeleteTransaction', () => {
  cy.intercept('DELETE', '**/transactions/*', {
    statusCode: 200,
    body: { success: true },
  }).as('deleteTransaction');
});

export {};
