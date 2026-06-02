/// <reference types="cypress" />

describe('Authentication', () => {
  describe('Registration', () => {
    it('should show registration form and submit', () => {
      cy.visit('/register')
      cy.contains('h1', 'Create Account').should('be.visible')
      cy.contains('Register').should('be.visible')

      cy.get('input[name="username"]').type('newuser')
      cy.get('input[name="email"]').type('newuser@example.com')
      cy.get('input[name="password"]').type('password123')

      cy.get('button[type="submit"]').click()
    })
  })

  describe('Login', () => {
    it('should redirect to /login when visiting protected route unauthenticated', () => {
      cy.visit('/add')
      cy.url().should('include', '/login')
      cy.contains('Welcome Back').should('be.visible')
    })

    it('should show login form', () => {
      cy.visit('/login')
      cy.contains('h1', 'Welcome Back').should('be.visible')
      cy.contains('Sign In').should('be.visible')
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('should navigate to register page from login', () => {
      cy.visit('/login')
      cy.contains('Create one').click()
      cy.url().should('include', '/register')
      cy.contains('h1', 'Create Account').should('be.visible')
    })

    it('should show error with wrong credentials', () => {
      cy.visit('/login')
      cy.get('input[name="username"]').type('wronguser')
      cy.get('input[name="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()
    })

    it('should login successfully and show username in navbar', () => {
      cy.visit('/login')
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()
    })
  })

  describe('Logout', () => {
    it('should redirect to /login after logout', () => {
      cy.visit('/login')
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      cy.get('button[aria-label="Log out"]').should('be.visible')
      cy.get('button[aria-label="Log out"]').click()
      cy.url().should('include', '/login')
      cy.contains('Welcome Back').should('be.visible')
    })
  })
})
