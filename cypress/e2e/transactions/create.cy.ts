describe('Criar Transação', () => {
  beforeEach(() => {
    cy.mockTransactions();
    cy.mockCreateTransaction();
    cy.visit('/');
    cy.wait('@getTransactions');
  });

  it('deve exibir o formulário de nova transação', () => {
    cy.contains('h2', 'Nova Transação').should('be.visible');
    cy.get('form input[data-testid="amount"]').should('exist');
    cy.get('form input[data-testid="description"]').should('exist');
    cy.get('form select[data-testid="type"]').should('exist');
    cy.contains('button', 'Criar Transação').should('be.visible');
  });

  it('deve validar valor máximo', () => {
    cy.get('form input[data-testid="amount"]').clear().type('1.111.111,11');
    cy.get('form input[data-testid="description"]').type('Teste de valor alto');
    cy.contains('button', 'Criar Transação').click();

    cy.contains('O valor máximo é R$ 1.000.000,00').should('be.visible');
  });

  it('deve validar descrição mínima', () => {
    cy.get('form input[data-testid="amount"]').clear().type('100');
    cy.get('form input[data-testid="description"]').type('AB');
    cy.contains('button', 'Criar Transação').click();

    cy.contains('A descrição deve ter pelo menos 3 caracteres').should('be.visible');
  });

  it('deve criar transação com sucesso', () => {
    // Preenche o formulário corretamente
    cy.get('form input[data-testid="amount"]').clear().type('250.50');
    cy.get('form input[data-testid="description"]').type('Pagamento de teste');
    cy.get('form select[data-testid="type"]').select('credit');

    cy.contains('button', 'Criar Transação').click();

    // Aguarda a requisição
    cy.wait('@createTransaction');

    // Verifica toast de sucesso
    cy.contains('Transação criada com sucesso').should('be.visible');

    // Formulário deve ser limpo
    cy.get('form input[data-testid="amount"]').should('have.value', '');
    cy.get('form input[data-testid="description"]').should('have.value', '');
  });

  it('deve mostrar loading durante criação', () => {
    // Delay na resposta para ver o loading
    cy.intercept('POST', '**/transactions', {
      delay: 1000,
      statusCode: 201,
      body: { id: 'new-id', status: 'pending' },
    }).as('slowCreate');

    cy.get('form input[data-testid="amount"]').clear().type('100');
    cy.get('form input[data-testid="description"]').type('Teste loading');
    cy.contains('button', 'Criar Transação').click();

    // Deve mostrar estado de loading
    cy.contains('Processando...').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('deve exibir contador de caracteres', () => {
    cy.get('form input[data-testid="description"]').type('Teste');
    cy.contains('5/200 caracteres').should('be.visible');
  });
});
