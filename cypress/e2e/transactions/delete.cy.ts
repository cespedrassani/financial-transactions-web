describe('Deletar Transação', () => {
  beforeEach(() => {
    cy.mockTransactions();
    cy.mockDeleteTransaction();
    cy.visit('/');
    cy.wait('@getTransactions');
  });

  it('deve exibir botão de deletar em cada transação', () => {
    // Cada linha deve ter um botão de delete
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).find('button[title="Remover transação"]').should('exist');
    });
  });

  it('deve abrir modal de confirmação ao clicar em deletar', () => {
    // Clica no primeiro botão de deletar
    cy.get('button[title="Remover transação"]').first().click();

    // Modal deve aparecer
    cy.contains('Confirmar exclusão').should('be.visible');
    cy.contains('Tem certeza que deseja remover esta transação?').should('be.visible');
    cy.contains('Esta ação não pode ser desfeita').should('be.visible');

    // Botões do modal
    cy.contains('button', 'Cancelar').should('be.visible');
    cy.contains('button', 'Remover').should('be.visible');
  });

  it('deve fechar modal ao cancelar', () => {
    cy.get('button[title="Remover transação"]').first().click();

    // Clica em cancelar
    cy.contains('button', 'Cancelar').click();

    // Modal deve fechar
    cy.contains('Confirmar exclusão').should('not.exist');
  });

  it('deve fechar modal ao clicar no overlay', () => {
    cy.get('button[title="Remover transação"]').first().click();

    // Clica no overlay
    cy.get('.fixed.inset-0.bg-black\\/50').click({ force: true });

    // Modal deve fechar
    cy.contains('Confirmar exclusão').should('not.exist');
  });

  it('deve deletar transação ao confirmar', () => {
    // Conta transações antes
    cy.get('table tbody tr').should('have.length', 4);

    // Clica em deletar a primeira
    cy.get('button[title="Remover transação"]').first().click();

    // Confirma
    cy.contains('button', 'Remover').click();

    // Aguarda requisição
    cy.wait('@deleteTransaction');

    // Toast de sucesso
    cy.contains('Transação removida com sucesso').should('be.visible');

    // Modal deve fechar
    cy.contains('Confirmar exclusão').should('not.exist');
  });

  it('deve mostrar loading durante deleção', () => {
    // Delay na resposta
    cy.intercept('DELETE', '**/transactions/*', {
      delay: 1000,
      statusCode: 200,
      body: { success: true },
    }).as('slowDelete');

    cy.get('button[title="Remover transação"]').first().click();
    cy.contains('button', 'Remover').click();

    // Botão deve mostrar loading
    cy.get('button').contains('Remover').parent().find('svg.animate-spin').should('exist');
  });

  it('deve mostrar erro quando deleção falha', () => {
    cy.intercept('DELETE', '**/transactions/*', {
      statusCode: 500,
      body: { message: 'Erro interno' },
    }).as('failedDelete');

    cy.get('button[title="Remover transação"]').first().click();
    cy.contains('button', 'Remover').click();

    cy.wait('@failedDelete');

    // Toast de erro
    cy.contains('Erro ao remover transação').should('be.visible');
  });
});
