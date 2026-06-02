/// <reference types="cypress" />

Cypress.Commands.add('loginAs', (username: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { username, password },
    failOnStatusCode: false,
  })
})
