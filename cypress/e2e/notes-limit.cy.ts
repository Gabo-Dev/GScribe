describe('Business Rule: Max 2 Notes per User', () => {
    const TEST_USER = Cypress.env('test_email');
    const TEST_PASS = Cypress.env('test_password');

    beforeEach(() => {
        cy.login(TEST_USER, TEST_PASS);

        cy.visit('/');
        cy.wait(1000);

        cy.get('body').then($body => {
            if ($body.find('[aria-label="Delete Note"]').length > 0) {
                cy.log('Cleaning up old notes...');
                cy.get('[aria-label="Delete Note"]').each($btn => {
                    cy.wrap($btn).click({ force: true });
                    cy.contains('button', /Delete Note|Delete/i).click({ force: true });
                    cy.wait(500);
                });
            }
        });
    });
    it('Blocks the user after creating 2 notes', () => {
        cy.log(' Creating Note 1...');
        cy.get('input').first().type('Note 1');
        cy.get('textarea').first().type('Content 1');
        cy.contains('button', /SAVE|EXECUTE/i).click();

        cy.contains(/successfully|created/i).should('be.visible');

        cy.log(' Creating Note 2...');
        cy.wait(1000);
        cy.get('input').first().type('Note 2');
        cy.get('textarea').first().type('Content 2');
        cy.contains('button', /SAVE|EXECUTE/i).click();

        cy.contains(/successfully|created/i).should('be.visible');

        cy.log(' Checking Lock...');

        cy.contains(/MEMORY_FULL|LIMIT|LOCKED/i).should('be.visible');

        cy.get('button[type="submit"]').should('be.disabled');
    });
});