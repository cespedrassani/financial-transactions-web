import { mockTransactionsList } from '../../support/commands';

describe('Listar Transações', () => {
  beforeEach(() => {
    cy.mockTransactions();
    cy.visit('/');
    cy.wait('@getTransactions');
  });

  it('deve exibir a lista de transações', () => {
    cy.contains('h2', 'Transações').should('be.visible');

    // Verifica se as transações estão na tabela
    cy.contains('Pagamento de fornecedor').should('be.visible');
    cy.contains('Recebimento de cliente').should('be.visible');
    cy.contains('Taxa de serviço').should('be.visible');
  });

  it('deve exibir valores formatados em reais', () => {
    cy.contains('R$ 1.500,00').should('be.visible');
    cy.contains('R$ 3.200,50').should('be.visible');
  });

  it('deve exibir badges de status corretos', () => {
    cy.contains('Concluída').should('be.visible');
    cy.contains('Pendente').should('be.visible');
    cy.contains('Falhou').should('be.visible');
  });

  it('deve exibir badges de tipo corretos', () => {
    cy.contains('Débito').should('be.visible');
    cy.contains('Crédito').should('be.visible');
  });

  it('deve mostrar loading ao carregar', () => {
    cy.intercept('GET', '**/transactions*', {
      delay: 1000,
      statusCode: 200,
      body: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    }).as('slowLoad');

    cy.visit('/');
    cy.contains('Carregando transações...').should('be.visible');
  });

  it('deve mostrar mensagem quando não há transações', () => {
    cy.intercept('GET', '**/transactions*', {
      statusCode: 200,
      body: { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } },
    }).as('emptyList');

    cy.visit('/');
    cy.wait('@emptyList');

    cy.contains('Nenhuma transação encontrada').should('be.visible');
    cy.contains('Crie sua primeira transação').should('be.visible');
  });
});

describe('Filtrar Transações', () => {
  it('deve filtrar por status pendente', () => {
    const pendingOnly = mockTransactionsList.filter(t => t.status === 'pending');

    // Configura intercept ANTES do visit
    cy.intercept('GET', '**/transactions*', (req) => {
      const url = new URL(req.url);
      const status = url.searchParams.get('status');

      if (status === 'pending') {
        req.reply({
          statusCode: 200,
          body: {
            data: pendingOnly,
            meta: { total: pendingOnly.length, page: 1, limit: 10, totalPages: 1 },
          },
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            data: mockTransactionsList,
            meta: { total: mockTransactionsList.length, page: 1, limit: 10, totalPages: 1 },
          },
        });
      }
    }).as('transactions');

    cy.visit('/');
    cy.wait('@transactions');

    // Seleciona filtro de status usando data-testid
    cy.get('[data-testid="filter-status"]').select('pending');

    cy.wait('@transactions');

    // Deve mostrar apenas pendentes
    cy.contains('1 transação registrada').should('be.visible');
  });

  it('deve filtrar por tipo crédito', () => {
    const creditOnly = mockTransactionsList.filter(t => t.type === 'credit');

    // Configura intercept ANTES do visit
    cy.intercept('GET', '**/transactions*', (req) => {
      const url = new URL(req.url);
      const type = url.searchParams.get('type');

      if (type === 'credit') {
        req.reply({
          statusCode: 200,
          body: {
            data: creditOnly,
            meta: { total: creditOnly.length, page: 1, limit: 10, totalPages: 1 },
          },
        });
      } else {
        req.reply({
          statusCode: 200,
          body: {
            data: mockTransactionsList,
            meta: { total: mockTransactionsList.length, page: 1, limit: 10, totalPages: 1 },
          },
        });
      }
    }).as('transactions');

    cy.visit('/');
    cy.wait('@transactions');

    // Seleciona filtro de tipo usando data-testid
    cy.get('[data-testid="filter-type"]').select('credit');

    cy.wait('@transactions');

    cy.contains('Recebimento de cliente').should('be.visible');
  });

  it('deve limpar filtros', () => {
    // Configura intercept ANTES do visit
    cy.mockTransactions();

    cy.visit('/');
    cy.wait('@getTransactions');

    // Aplica um filtro usando data-testid
    cy.get('[data-testid="filter-status"]').select('pending');

    // Botão de limpar deve aparecer
    cy.contains('Limpar filtros').should('be.visible');

    // Clica para limpar
    cy.contains('Limpar filtros').click();

    // Filtros devem voltar ao padrão
    cy.get('[data-testid="filter-status"]').should('have.value', 'all');
  });
});
