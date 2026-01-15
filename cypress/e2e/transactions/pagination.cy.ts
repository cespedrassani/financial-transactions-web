describe('Paginação', () => {
  // Gera 25 transações para testar paginação
  const generateTransactions = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `id-${i + 1}`,
      externalId: `ext-${i + 1}`,
      amount: (i + 1) * 100,
      description: `Transação ${i + 1}`,
      status: ['pending', 'completed', 'failed'][i % 3] as 'pending' | 'completed' | 'failed',
      type: i % 2 === 0 ? 'debit' : 'credit' as 'debit' | 'credit',
      createdAt: new Date(2024, 0, 15 - i).toISOString(),
    }));
  };

  const allTransactions = generateTransactions(25);

  beforeEach(() => {
    cy.intercept('GET', '**/transactions*', (req) => {
      const url = new URL(req.url);
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');

      const start = (page - 1) * limit;
      const end = start + limit;
      const pageData = allTransactions.slice(start, end);

      req.reply({
        statusCode: 200,
        body: {
          data: pageData,
          meta: {
            total: allTransactions.length,
            page,
            limit,
            totalPages: Math.ceil(allTransactions.length / limit),
          },
        },
      });
    }).as('paginatedTransactions');

    cy.visit('/');
    cy.wait('@paginatedTransactions');
  });

  it('deve exibir total de transações', () => {
    cy.contains('Total de 25 transações').should('be.visible');
  });

  it('deve exibir 10 transações por página', () => {
    cy.get('table tbody tr').should('have.length', 10);
  });

  it('deve exibir botões de paginação', () => {
    // 25 itens / 10 por página = 3 páginas
    cy.contains('button', '1').should('be.visible');
    cy.contains('button', '2').should('be.visible');
    cy.contains('button', '3').should('be.visible');
  });

  it('deve navegar para próxima página', () => {
    // Clica no botão "próxima"
    cy.get('button[title="Próxima página"]').click();

    cy.wait('@paginatedTransactions');

    // Página 2 deve estar ativa
    cy.contains('button', '2').should('have.class', 'bg-blue-600');

    // Deve mostrar transações 11-20
    cy.contains('Transação 11').should('be.visible');
  });

  it('deve navegar para página anterior', () => {
    // Vai para página 2
    cy.contains('button', '2').click();
    cy.wait('@paginatedTransactions');

    // Volta para página 1
    cy.get('button[title="Página anterior"]').click();
    cy.wait('@paginatedTransactions');

    // Página 1 deve estar ativa
    cy.contains('button', '1').should('have.class', 'bg-blue-600');
  });

  it('deve navegar clicando no número da página', () => {
    cy.contains('button', '3').click();

    cy.wait('@paginatedTransactions');

    // Página 3 deve estar ativa
    cy.contains('button', '3').should('have.class', 'bg-blue-600');

    // Deve mostrar transações 21-25 (5 itens na última página)
    cy.get('table tbody tr').should('have.length', 5);
    cy.contains('Transação 21').should('be.visible');
  });

  it('deve desabilitar botão anterior na primeira página', () => {
    cy.get('button[title="Página anterior"]').should('be.disabled');
  });

  it('deve desabilitar botão próxima na última página', () => {
    cy.contains('button', '3').click();
    cy.wait('@paginatedTransactions');

    cy.get('button[title="Próxima página"]').should('be.disabled');
  });

  it('deve resetar para página 1 ao aplicar filtro', () => {
    // Vai para página 2
    cy.contains('button', '2').click();
    cy.wait('@paginatedTransactions');

    // Aplica filtro usando data-testid
    cy.get('[data-testid="filter-status"]').select('pending');
    cy.wait('@paginatedTransactions');

    // Deve voltar para página 1
    cy.contains('button', '1').should('have.class', 'bg-blue-600');
  });
});

describe('Paginação - Sem dados suficientes', () => {
  it('não deve exibir paginação com menos de 10 itens', () => {
    cy.intercept('GET', '**/transactions*', {
      statusCode: 200,
      body: {
        data: [
          { id: '1', description: 'Única transação', amount: 100, status: 'pending', type: 'debit', createdAt: new Date().toISOString() },
        ],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      },
    }).as('singleTransaction');

    cy.visit('/');
    cy.wait('@singleTransaction');

    // Não deve haver botões de página
    cy.get('button[title="Próxima página"]').should('not.exist');
    cy.get('button[title="Página anterior"]').should('not.exist');
  });
});
