/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginAs(username: string, password: string): Chainable<void>
  }
}
