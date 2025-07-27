// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to login with valid credentials
Cypress.Commands.add('loginWithValidCredentials', () => {
  cy.visit('/login')
  cy.get('input[type="email"]').type('test@example.com')
  cy.get('input[type="password"]').type('password123')
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/todos')
})

// Custom command to login with invalid credentials
Cypress.Commands.add('loginWithInvalidCredentials', () => {
  cy.visit('/login')
  cy.get('input[type="email"]').type('wrong@example.com')
  cy.get('input[type="password"]').type('wrongpassword')
  cy.get('button[type="submit"]').click()
})

// Custom command to create a new todo
Cypress.Commands.add('createTodo', (title, description = '') => {
  cy.get('button').contains('Add New Todo').click()
  cy.get('input[placeholder*="What needs to be done"]').type(title)
  if (description) {
    cy.get('textarea[placeholder*="Add more details"]').type(description)
  }
  cy.get('button').contains('Add Todo').click()
})

// Custom command to wait for loading to complete
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('.animate-spin').should('not.exist')
})