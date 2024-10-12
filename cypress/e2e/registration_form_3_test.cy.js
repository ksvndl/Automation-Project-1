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
describe('Visual tests for Registration Form 3', () => {

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
    it('Check Privacy policy checkbox', () => {
        cy.get('input[type="checkbox"]').eq(0).as('privacy')
        cy.get('@privacy').should('not.be.selected')
        cy.get('div').contains('privacy policy').should('contain', 'Accept our privacy policy')
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
        cy.get('span[ng-show="myForm.email.$error.email"]').should('be.visible')
            .should('have.text', 'Invalid email address.')
            .should('have.css', 'color', 'rgb(255, 0, 0)')
        cy.get('span[ng-show="myForm.email.$error.required"]').should('not.be.visible')
        cy.get('input[type="email"]').clear()
        cy.get('span[ng-show="myForm.email.$error.required"]').should('be.visible')
            .should('have.text', 'Email is required.')
            .should('have.css', 'color', 'rgb(255, 0, 0)')
        cy.get('span[ng-show="myForm.email.$error.email"]').should('not.be.visible')
    })

    describe('Email input validation', () => {
        const invalidEmails = [
            { email: 'user@', description: 'Missing domain: ' },
            { email: 'user@example', description: 'Incorrect domain: ' },
            { email: '@example.com', description: 'Missing username: ' },
            { email: 'user@example#com', description: 'Special characters: ' },
            { email: 'user@example.com.', description: 'Extra period: ' },
            { email: 'user@example..com', description: 'Double period: ' }
            // ... other invalid email cases with descriptions
        ]

        invalidEmails.forEach(invalidEmail => {
            it(invalidEmail.description.concat(invalidEmail.email), () => {
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

describe('Functional tests for Registration Form 3', () => {

    it('All required fields have required attribute and are empty', () => {

        cy.get('[required]').then(required => {
            expect(required).to.have.length(required.length)
            const requiredID = [...required].map(required => ({ id: required.id, name: required.name }))
            cy.log(JSON.stringify(requiredID))
            cy.wrap(required).should('have.attr', 'required')
            cy.wrap(required).should('be.empty')
        })
    })

    it('User can submit form with all fields filled', () => {

        fillRequired()
        fillOptional()
        cy.get('h2').contains('Birthday').click()
        cy.get('input[type="submit"]').should('be.enabled')
        cy.get('#successFrame').should('not.be.visible')
        cy.get('input[type="submit"]').click()
        //cy.get('#successFrame').should('be.visible').and('contain', 'Successful registration').screenshot().as('successMessage')
        cy.get('body').should('contain', 'Submission received')
    })

    it('User can submit form with only mandatory fields filled', () => {
        fillRequired()
        cy.get('h2').contains('Birthday').click()
        cy.get('input[type="submit"]').should('be.enabled')
        cy.get('#successFrame').should('not.be.visible')
        cy.get('input[type="submit"]').click()
        cy.get('body').should('contain', 'Submission received')
    })

    describe('User can not submit form with required fields missing', () => {
        const requiredFields = [
            { selector: '#name', description: 'Name: ', eq: '0', type: 'field' },
            { selector: 'input[name="email"]', description: 'Email: ', eq: '0', type: 'field' },
            { selector: '#birthday', description: 'Birthday: ', eq: '0', type: 'field' },
            // ... other mandatory field with descriptions
        ]
        const requiredDropdown = [
            { selector: '#country', description: 'Country: ', eq: '0', type: 'dropdown' },
            { selector: '#city', description: 'City: ', eq: '0', type: 'dropdown' },
        ]
        const requiredCheckbox = [
            { selector: 'input[type="checkbox"]', description: 'Privacy: ', eq: '0', type: 'checkbox' },
            { selector: 'input[type="checkbox"]', description: 'Cookie: ', eq: '1', type: 'checkbox' },
        ]
        const text = 'Missing required field = '

        requiredFields.forEach(requiredField => {
            it(text.concat(requiredField.description, requiredField.selector), () => {
                fillRequired()

                cy.get(requiredField.selector).clear()
                cy.get('h2').contains('Birthday').click()
                cy.get('input[type="submit"]').should('not.be.enabled')
                cy.get('#successFrame').should('not.be.visible')
            })
        })

        requiredDropdown.forEach(requiredDropdown => {
            it(text.concat(requiredDropdown.description, requiredDropdown.selector), () => {
                fillRequired()
                cy.get(requiredDropdown.selector).select(0)
                cy.get('h2').contains('Birthday').click()
                cy.get('input[type="submit"]').should('not.be.enabled')
                cy.get('#successFrame').should('not.be.visible')
            })
        })
        requiredCheckbox.forEach(requiredCheckbox => {
            it(text.concat(requiredCheckbox.description, requiredCheckbox.selector), () => {
                fillRequired()
                cy.get(requiredCheckbox.selector).eq(requiredCheckbox.eq).uncheck()
                cy.get('h2').contains('Birthday').click()
                cy.get('input[type="submit"]').should('not.be.enabled')
                cy.get('#successFrame').should('not.be.visible')
            })
        })
    })

    it('User can add file', () => {
        const fileName = 'cypress_logo.png'
        cy.get('input[type="file"]').should('have.value', '')
        cy.get('input[type="file"]').attachFile(fileName)
        cy.get('input[type="file"]').should('have.value', 'C:\\fakepath\\cypress_logo.png')
        cy.get('button[type="submit"]').click()
        cy.url().should('contain', '/upload_file.html')
        cy.get('h1').contains('Submission received')
        cy.go('back')
        cy.log('Back again in registration page')
        cy.url().should('contain', '/registration_form_3.html')
    })

})

function fillRequired() {
    cy.get('#name').type(fullName)
    cy.get('[name="email"]').type(email)
    cy.get('#country').select(faker.number.int({ min: 1, max: 3 }))
    cy.get('#city').children().then(city => {
        const cityCount = city.length - 1
        const citySelect = 'No of cities to choose from: '
        cy.log(citySelect.concat(cityCount))
        cy.get('#city').select(faker.number.int({ min: 1, max: cityCount }))
    })
    cy.get('#birthday').type(birthday)
    cy.get('input[type="checkbox"]').check()
}

function fillOptional() {
    cy.get('input[type="date"]').eq(0).type(regDate)
    cy.get('input[type="radio"]').eq(1).check().should('be.enabled')
}


import { DateModule, faker } from '@faker-js/faker'
import 'cypress-file-upload'
const firstName = faker.person.firstName()
const lastName = faker.person.lastName()
const fullName = firstName.concat(' ', lastName)
const phoneNumber = faker.number.int({ min: 10000000, max: 9999999999 })
const firstName_lower = firstName.toLowerCase()
const lastName_lower = lastName.toLowerCase()
const userName = firstName_lower.concat(lastName_lower, faker.number.int({ max: 99 }))
const email = userName.concat('@tribe12.lk')
const password = faker.internet.password({ length: 8, memorable: false, pattern: /[A-Za-z0-9]/ })
const birthDayTime = new Date(faker.date.birthdate())
const birthday = birthDayTime.toISOString().split('T')[0]
const regDate = faker.date.past().toISOString().split('T')[0]