beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4: add content to the following tests
*/

describe('Section 1: Functional tests', () => {

    it('User can use only same both first and validation passwords', () => {
        // Add test steps for filling in only mandatory fields
        cy.get('input#username').type(randomUserName)
        cy.get('input#email').type(randomEmail)
        cy.get('input[name="name"]').type(randomFirstName)
        cy.get('input#lastName').type(randomLastName)
        cy.get('input[data-testid="phoneNumberTestId"]').type(randomPhoneNumber)
        cy.get('input[type="password"]').eq(0).type(Password)

        // Type confirmation password which is different from first password
        cy.get('input[type="password"]').eq(1).type(Password.concat('1'))

        // Assert that submit button is not enabled
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('not.be.enabled')

        // Assert that successful message is not visible
        cy.get('#success_message').should('not.be.visible')

        // Assert that error message is visible
        cy.get('#password_error_message').should('be.visible')

        // Change the test, so the passwords would match
        cy.get('input[type="password"]').eq(1).clear().type(Password)

        // Add assertion, that error message is not visible anymore
        cy.get('h2').contains('Password').click()
        cy.get('#password_error_message').should('not.be.visible')

        // Add assertion, that submit button is now enabled
        cy.get('.submit_button').should('be.enabled')
    })

    it('User can submit form with all fields added', () => {
        // Add test steps for filling in ALL fields
        cy.get('input#username').type(randomUserName)
        cy.get('input#email').type(randomEmail)
        cy.get('input[name="name"]').type(randomFirstName)
        cy.get('input#lastName').type(randomLastName)
        cy.get('input[data-testid="phoneNumberTestId"]').type(randomPhoneNumber)
        cy.get('[type="radio"]').eq(2).check()
        cy.get('[type="checkbox"]').eq(2).check()
        cy.get('select#cars').select('Audi')
        cy.get('select#animal').select('cow')
        cy.get('input[type="password"]').eq(0).type(Password)
        cy.get('input[type="password"]').eq(1).type(Password)

        // Assert that submit button is enabled
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')

        // Assert that after submitting the form system show successful message
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
            .contains('User successfully submitted registration')

    })
    //Duplicate of previous for functions test
    it('User can submit form with all fields added - copy -- test fill function', () => {

        inputValidMandatoryData()
        inputValidOptionalData()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
            .contains('User successfully submitted registration')

    })

    it('User can submit form with valid data and only mandatory fields added', () => {
        // Add test steps for filling in ONLY mandatory fields
        inputValidMandatoryData()

        // Assert that submit button is enabled
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')

        // Assert that after submitting the form system shows successful message
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
            .contains('User successfully submitted registration')

        // example, how to use function, which fills in all mandatory data
        // in order to see the content of the function, scroll to the end of the file
    })

    // Add at least 1 test for checking some mandatory field's absence

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

/*
Assignement 5: create more visual tests
*/

describe('Section 2: Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check cerebrum hub logo source and size')
        cy.get('img').eq(0).should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height
        // it should be less than 178 and greater than 100
        cy.get('img').eq(0).invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)
    })

    it('Check that second logo is correct and has correct size', () => {
        cy.log('Will check cypress logo source and size')
        cy.get('img').eq(1).should('have.attr', 'src').should('include', 'cypress_logo')
        // get element and check its parameter height
        // it should be less than 178 and greater than 100
        cy.get('img').eq(1).invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)
    })

    it('Check navigation to form 1', () => {
        cy.get('nav').children().should('have.length', 2)

        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')

        // Get navigation element, find its first child, check the link content and click it
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()

        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_1.html')

        // Go back to previous page
        cy.go('back')
        cy.url().should('contain', '/registration_form_2.html')
        cy.log('Back again in registration form 2')

    })

    // Create similar test for checking the second link 

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
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'PHP')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from the other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    // Create test similar to previous one verifying check boxes
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
        // Here is just an example how to explicitely create screenshot from the code
        // Select second element and create screenshot for this area or full page
        cy.get('#cars').select(1).screenshot('Cars drop-down')
        cy.screenshot('Full page screenshot')

        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)

        // Check that first element in the dropdown has text Volvo
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')

        // Advanced level how to check the content of the Cars dropdown
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })

    // Create test similar to previous one
    it('Favourite animal dropdown is correct', () => {
        cy.get('#animal').children().should('have.length', 6)
        cy.get('#animal').find('option').each((option, index) => {
            const expectedValue = ['dog', 'cat', 'snake', 'hippo', 'cow', 'mouse'][index]
            const expectedText = ['Dog', 'Cat', 'Snake', 'Hippo', 'Cow', 'Horse'][index] // The form labels and values are different in context!

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

function inputValidData(username) {
    cy.log('Username will be filled')
    cy.get('input[data-testid="user"]').type(username)
    cy.get('#email').type('validemail@yeap.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    cy.get('#password').type('MyPass')
    cy.get('#confirm').type('MyPass')
    cy.get('h2').contains('Password').click()
}

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