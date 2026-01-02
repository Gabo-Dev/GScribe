/// <reference types="cypress" />

Cypress.Commands.add('login', (email, password) => {
  // Usamos cy.session para guardar la sesión y no loguearnos 50 veces
  cy.session([email, password], () => {
    cy.visit('/');
    
    // Estos selectores asumen inputs estándar. Ajústalos si tus inputs tienen otros IDs/Names.
    cy.get('input[type="email"]').should('be.visible').type(email);
    cy.get('input[type="password"]').should('be.visible').type(password);
    
    // Busca el botón que contenga "Sign In" o "Login" y haz click
    cy.contains('button', /Sign In|Login/i).click();

    // Verificamos que hemos entrado (buscando algo del dashboard)
    cy.url().should('not.include', '/login');
  });
  
  // Después de restaurar la sesión, vamos al sitio
  cy.visit('/');
});

// Esto es para que TypeScript no se queje
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
    }
  }
}