beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

describe('Section 1: Functional tests', () => {

    it('User can use only same both first and validation passwords', () => {
        inputValidMandatoryData()
        cy.get('input[type="password"]').eq(1).clear()
        cy.get('input[type="password"]').eq(1).type(Password.concat('1'))
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#password_error_message').should('be.visible')
        cy.get('input[type="password"]').eq(1).clear().type(Password)
        cy.get('h2').contains('Password').click()
        cy.get('#password_error_message').should('not.be.visible')
        cy.get('.submit_button').should('be.enabled')
    })

    it('User can submit form with all fields added', () => {
        inputValidMandatoryData()
        inputValidOptionalData()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
            .contains('User successfully submitted registration')
    })

    it('User can submit form with valid data and only mandatory fields added', () => {
        inputValidMandatoryData()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
            .contains('User successfully submitted registration')
    })

    it('User can not submit form with mandatory username missing', () => {
        inputValidMandatoryData()
        cy.get('input#username').clear()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible')
            .contains('Mandatory input field is not valid or empty!')
    })

    it('User can not submit form with mandatory email missing', () => {
        inputValidMandatoryData()
        cy.get('input#email').clear()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible')
            .contains('Mandatory input field is not valid or empty!')
    })

    it('User can not submit form with mandatory phone number missing', () => {
        inputValidMandatoryData()
        cy.get('input[data-testid="phoneNumberTestId"]').clear()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible')
            .contains('Mandatory input field is not valid or empty!')
    })

})

describe('Section 2: Visual tests', () => {

    it('Check that Cerebrum Hub logo is correct and has correct size', () => {
        cy.log('Will check cerebrum hub logo source and size')
        cy.get('img').eq(0).should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        cy.get('img').eq(0).invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)
    })

    it('Check that Cyress logo is correct and has correct size', () => {
        cy.log('Will check cypress logo source and size')
        cy.get('img').eq(1).should('have.attr', 'src').should('include', 'cypress_logo')
        cy.get('img').eq(1).invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)
    })

    it('Check navigation to Form 1', () => {
        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .and('have.text', 'Registration form 1')
            .click()
        cy.url().should('contain', '/registration_form_1.html')
        cy.go('back')
        cy.url().should('contain', '/registration_form_2.html')
        cy.log('Back again in registration form 2')

    })

    it('Check navigation to form 3', () => {

        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .and('have.text', 'Registration form 3')
            .click()
        cy.url().should('contain', '/registration_form_3.html')
        cy.go('back')
        cy.url().should('contain', '/registration_form_2.html')
        cy.log('Back again in registration form 2')
    })

    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)

        cy.get('input[type="radio"]').eq(0)
            .should('have.attr', 'value', 'HTML')
            .next().should('have.text', 'HTML')

        cy.get('input[type="radio"]').eq(1)
            .should('have.attr', 'value', 'CSS')
            .next().should('have.text', 'CSS')

        cy.get('input[type="radio"]').eq(2)
            .should('have.attr', 'value', 'JavaScript')
            .next().should('have.text', 'JavaScript')
        cy.get('input[type="radio"]').eq(3)
            .should('have.attr', 'value', 'php')
            .next().should('have.text', 'PHP')

        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Check that checkbox list is correct', () => {
        cy.get('input[type="checkbox"]').should('have.length', 3)

        cy.get('input[type="checkbox"]').eq(0)
            .should('have.attr', 'value', 'Bike')
            .next().should('have.text', 'I have a bike')

        cy.get('input[type="checkbox"]').eq(1)
            .should('have.attr', 'value', 'Car')
            .next().should('have.text', 'I have a car')

        cy.get('input[type="checkbox"]').eq(2)
            .should('have.attr', 'value', 'Boat')
            .next().should('have.text', 'I have a boat')

        cy.get('input[type="checkbox"]').eq(0).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(1).should('not.be.checked')
        cy.get('input[type="checkbox"]').eq(2).should('not.be.checked')

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
    })


    it('Car dropdown is correct', () => {

        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })

    })

    it('Favourite animal dropdown is correct', () => {
        cy.get('#animal').children().should('have.length', 6)

        cy.get('#animal').find('option').each((option, index) => {
            const expectedValue = ['dog', 'cat', 'snake', 'hippo', 'cow', 'mouse'][index]
            const expectedText = ['Dog', 'Cat', 'Snake', 'Hippo', 'Cow', 'Horse'][index]
            // The form labels and values are different in context!

            cy.log(JSON.stringify('Value: '.concat(expectedValue)))
            cy.log(JSON.stringify('Text: '.concat(expectedText)))

            cy.wrap(option).should('have.value', expectedValue)
            cy.wrap(option).should('have.text', expectedText)

        })
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

function inputValidMandatoryData() {
    cy.log('Mandatory data will be fileld')
    cy.get('input#username').type(randomUserName)
    cy.get('input#email').type(randomEmail)
    cy.get('input[name="name"]').type(randomFirstName)
    cy.get('input#lastName').type(randomLastName)
    cy.get('input[data-testid="phoneNumberTestId"]').type(randomPhoneNumber)
    cy.get('input[type="password"]').eq(0).type(Password)
    cy.get('input[type="password"]').eq(1).type(Password)
}

function inputValidOptionalData() {
    cy.log('Optional data will be filled')
    cy.get('[type="radio"]').eq(2).check()
    cy.get('[type="checkbox"]').eq(2).check()
    cy.get('select#cars').select('Audi')
    cy.get('select#animal').select('cow')
}