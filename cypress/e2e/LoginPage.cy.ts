// cypress/integration/login.spec.js

describe('Login', () => {
  it('should login successfully', () => {
    // Visit the login page
    cy.visit('https://seahorse-app-zumzx.ondigitalocean.app/login');
    
    // Enter login credentials
    cy.get('input[type="text"]').type('ep');
    cy.get('input[type="password"]').type('ep ');

    // Click the login button
    cy.get('button#login').click();

    // Assert that the user is redirected to the dashboard
    cy.url().should('include', '/dashboard');

    // Additional assertions or actions can be added based on your application's behavior
    // For example, you might want to check if a welcome message is displayed after login
    cy.get('.logout-link').should('exist');
  });
});
