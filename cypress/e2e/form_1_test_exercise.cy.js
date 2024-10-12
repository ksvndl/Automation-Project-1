beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_1.html')
})

// NB! this is copy of registration_form_1_test.cy.js

/*
Tasks done during VS Code live demo:
1 and 2 - If you see this text and found file location in project tree, great job!
3 - Find "MyPass123" - and then duplicate line 20 by using Shift + Alt + DownArrow
4 - Uncomment lines 18 - 21
5 - Find and replace username2 to username
6 - autoformat the code, using Shift + Alt + F
 */

describe('This is first test suite, Lauri Kasvand', () => {
    it('User can submit data only when valid mandatory values are added', () => {
        cy.get('input[name="password"]').type('Lumitulimahajavalgeksläksmaa')
        cy.get('[name="confirm"]').type('Lumitulimahajavalgeksläksmaa')
        cy.get('#username').type('Something')
        cy.get('#firstName').type(firstName)
        cy.get('#lastName').type(lastName)
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()

        // Assert that both input and password error messages are not shown
        // next 2 lines check exactly the same, but using different approach
        cy.get('#input_error_message').should('not.be.visible')
        cy.get('#password_error_message').should('have.css', 'display', 'none')

        // Assert that successful message is visible
        // next 2 lines check exactly the same, but using different approach
        cy.get('#success_message').should('be.visible')
        cy.get('#success_message').should('have.css', 'display', 'block')
    });
})