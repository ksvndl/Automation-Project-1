beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
describe('Visual tests for Registration Form 4', () => {

    it('Radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
            .as('RadioButtons')
        cy.get('@RadioButtons').each((radioButton, index) => {
            const expectedValue = ['Daily', 'Weekly', 'Monthly', 'Never'][index]
            const expectedText = ['Daily', 'Weekly', 'Monthly', 'Never'][index]

            cy.wrap(radioButton).should('have.value', expectedValue)
            cy.wrap(radioButton).next().should('have.text', expectedText)
            cy.wrap(radioButton).should('not.be.checked')
        })
        cy.get('@RadioButtons').eq(0).check().should('be.checked')
        cy.get('@RadioButtons').eq(1).check().should('be.checked')
        cy.get('@RadioButtons').eq(0).should('not.be.checked')
    })

    it('Countries list is displayed correctly', () => {
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').each((country, index) => {
            const expectedValue = ['', 'object:3', 'object:4', 'object:5'][index]
            const expectedText = ['', 'Spain', 'Estonia', 'Austria'][index]

            cy.wrap(country).should('have.value', expectedValue)
            cy.wrap(country).should('have.text', expectedText)
        })

        cy.get('#country').select('object:3')
        cy.get('#country [value="object:3"]').should('be.selected')
        cy.get('#country').select('')
        cy.get('#country [value=""]').should('be.selected')
        cy.get('#country [value="object:3"]').should('not.be.selected')

    })

    it('Cities list is displayed correctly and dependently for country', () => {
        cy.get('#country').select('')
        cy.get('#city').children().should('have.length', 1).should('be.empty')

        cy.get('#country').select('object:3')
        cy.get('#city').children().should('have.length', 5)
        cy.get('#city').find('option').each((option, index) => {
            const expectedValue = ['', 'string:Malaga', 'string:Madrid', 'string:Valencia', 'string:Corralejo'][index]
            const expectedText = ['', 'Malaga', 'Madrid', 'Valencia', 'Corralejo'][index]

            cy.wrap(option).should('have.value', expectedValue)
            cy.wrap(option).should('have.text', expectedText)
        })
        cy.get('#country').select('object:4')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').each((option, index) => {
            const expectedValue = ['', 'string:Tallinn', 'string:Haapsalu', 'string:Tartu'][index]
            const expectedText = ['', 'Tallinn', 'Haapsalu', 'Tartu'][index]

            cy.wrap(option).should('have.value', expectedValue)
            cy.wrap(option).should('have.text', expectedText)
        })
        cy.get('#country').select('object:5')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').find('option').each((option, index) => {
            const expectedValue = ['', 'string:Vienna', 'string:Salzburg', 'string:Innsbruck'][index]
            const expectedText = ['', 'Vienna', 'Salzburg', 'Innsbruck'][index]

            cy.wrap(option).should('have.value', expectedValue)
            cy.wrap(option).should('have.text', expectedText)
        })
    })

    it('CIty selection is removed when different country is selected', () => {
        cy.get('#country').select('object:3')
        cy.get('#country [value="object:3"]').should('be.selected')
        cy.get('#city').select('string:Madrid')
        cy.get('#city [value="string:Madrid"]').should('be.selected')

        cy.get('#country').select('object:4')
        cy.get('#country [value="object:4"]').should('be.selected')
        cy.get('#city').should('not.be.selected')
    })
    // finds text from page
    it.only('Check Privacy policy checkbox', () => {
        cy.get('input[type="checkbox"]').eq(0).as('privacy')
        cy.get('@privacy').should('not.be.selected')
        cy.get('div').contains('privacy policy').should('contain', 'Accept our privacy policy')
        cy.get('@privacy').check().should('be.checked')
        cy.get('@privacy').uncheck().should('not.be.checked')
    })

    // should find text but doesn't
    it.only('Check Privacy policy checkbox', () => {
        cy.get('input[type="checkbox"]').eq(0).as('privacy')
        cy.get('@privacy').should('not.be.selected')
        cy.get('@privacy').should('contain', 'Accept our privacy policy')
        cy.get('@privacy').check().should('be.checked')
        cy.get('@privacy').uncheck().should('not.be.checked')
    })

    it('Check Cookie policy checkbox and link', () => {
        cy.get('input[type="checkbox"]').eq(1).as('cookie')
        cy.get('@cookie').should('not.be.checked')
        cy.get('@cookie').check().should('be.checked')
        cy.get('@cookie').uncheck().should('not.be.checked')

        cy.get('div button').contains('cookie').as('cookieButton')
        cy.get('@cookieButton').should('contain', 'Accept our cookie policy')
        cy.get('@cookieButton').click()
        cy.url().should('contain', 'cookiePolicy.html')
        cy.go('back')
        cy.url().should('contain', '/registration_form_3.html')
        cy.log('Back again in registration form 3')
    })

    it('Check correct error messages when invalid or empty', () => {
        cy.get('input[type="email"]').clear().type('1')
        cy.get('span[ng-show="myForm.email.$error.email"]').should('be.visible').should('have.text', 'Invalid email address.')
        cy.get('span[ng-show="myForm.email.$error.required"]').should('not.be.visible')
        cy.get('input[type="email"]').clear()
        cy.get('span[ng-show="myForm.email.$error.required"]').should('be.visible').should('have.text', 'Email is required.')
        cy.get('span[ng-show="myForm.email.$error.email"]').should('not.be.visible')
    })

    describe('Email input validation', () => {
        const invalidEmails = [
            { email: 'user@', description: 'Missing domain' },
            { email: 'user@example', description: 'Incorrect domain' },
            { email: '@example.com', description: 'Missing username' },
            { email: 'user@example#com', description: 'Special characters' },
            { email: 'user@example.com.', description: 'Extra period' },
            { email: 'user@example..com', description: 'Double period' }
            // ... other invalid email cases with descriptions
        ]

        invalidEmails.forEach(invalidEmail => {
            it(invalidEmail.description.concat(': ',invalidEmail.email), () => {
                cy.get('input[type="email"]').clear().type(invalidEmail.email)
                cy.get('span[ng-show="myForm.email.$error.email"]').should('be.visible').should('have.text', 'Invalid email address.')
                cy.get('span[ng-show="myForm.email.$error.required"]').should('not.be.visible')
            })
        })
    })
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */

describe('Functional tests for Registration Form 4', () => {

    it('All fiealds are filled', () => {

    })
})

import { faker } from '@faker-js/faker'
const randomFirstName = faker.person.firstName()
const randomLastName = faker.person.lastName()
const randomPhoneNumber = faker.number.int({ min: 10000000, max: 9999999999 })
const randomFirstName_lower = randomFirstName.toLowerCase()
const randomLastName_lower = randomLastName.toLowerCase()
const randomUserName = randomFirstName_lower.concat(randomLastName_lower, faker.number.int({ max: 99 }))
const randomEmail = randomUserName.concat('@tribe12.lk')
const Password = faker.internet.password({ length: 8, memorable: false, pattern: /[A-Za-z0-9]/ })
