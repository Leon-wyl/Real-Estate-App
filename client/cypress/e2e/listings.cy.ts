/// <reference types="cypress" />

describe('Property Listings', () => {
  describe('Search', () => {
    it('should search for properties from home page', () => {
      cy.visit('/')
      cy.contains('h1', 'Find Your Dream Home').should('be.visible')

      // Toggle to Rent
      cy.contains('Rent').click()

      // Type city
      cy.get('input[placeholder="City"]').type('New York')

      // Click Search
      cy.contains('button', 'Search').click()

      // Should navigate to /list with params
      cy.url().should('include', '/list')
      cy.url().should('include', 'type=rent')
      cy.url().should('include', 'city=New')
    })
  })

  describe('Filters', () => {
    it('should show filter options on listings page', () => {
      cy.visit('/list')
      cy.contains('h1', 'Property Listings').should('be.visible')

      // Filter sidebar should be visible on desktop
      cy.contains('Filters').should('be.visible')
    })

    it('should update URL when applying filters', () => {
      cy.visit('/list')

      // Select property type
      cy.get('#property').click()
      cy.contains('Apartment').click()

      // Select bedrooms
      cy.get('#bedroom').click()
      cy.contains('2 Beds').click()

      // Click Apply
      cy.contains('button', 'Apply Filters').click()

      // URL should update
      cy.url().should('include', 'property=apartment')
      cy.url().should('include', 'bedroom=2')
    })
  })

  describe('Property Detail', () => {
    it('should display property detail page', () => {
      cy.visit('/1')

      // Should show property details
      cy.contains('h1').should('be.visible')
      cy.get('img').should('exist')
    })

    it('should navigate to property detail from home page', () => {
      cy.visit('/')

      // Click first property card link
      cy.get('a[href^="/"][href*="-"]').first().click({ force: true })

      // Should be on property detail page (not home)
      cy.url().should('not.equal', Cypress.config().baseUrl + '/')
      cy.url().should('not.match', /\/list/)
    })
  })
})
