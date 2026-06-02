/// <reference types="cypress" />

describe('Error Handling', () => {
  describe('404 Page', () => {
    it('should show 404 and Page Not Found for nonexistent routes', () => {
      cy.visit('/nonexistent-route-xyz', { failOnStatusCode: false })

      cy.contains('404').should('be.visible')
      cy.contains('Page Not Found').should('be.visible')
    })

    it('should have a back to home button that works', () => {
      cy.visit('/nonexistent-route-xyz', { failOnStatusCode: false })

      cy.contains('Back to Home').should('be.visible')
      cy.contains('Back to Home').click()
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.contains('h1', 'Find Your Dream Home').should('be.visible')
    })
  })
})
