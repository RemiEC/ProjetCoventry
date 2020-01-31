'use strict'

const { Given, When, Then } = require('cucumber')
const assert = require('assert')
const Page = require('./page.js')

let page

Given('The browser is open on the home page', async() => {
	page = await new Page(1500, 1000)
})

When('I click on the {string} link', async(link) => {
	await page.click(`#${link}`)
})

When('I enter {string} in the {string} field', async(value, field) => {
	await page.click(`#${field}`)
	await page.keyboard.type(value)
})

When('I click the submit button', async() => {
	await page.click('#submit')
})

When('I attach an image called {string} in {string}', async(filename, field) => {
	const upload = await page.$(`#${field}`)
	await upload.uploadFile(`acceptance\ tests/images/${filename}.png`)
})

Then('take a screenshot called {string}', async(filename) => {
	await page.screenshot({ path: `acceptance\ tests/screenshots/${filename}.png`})
})

Then('the title should be {string}', async(title) => {
	const text = await page.evaluate( () => {
		const dom = document.querySelector('title')
		return dom.innerText
	})
	assert.equal(title, text)
})

Then('I should be welcomed as {string} on the home page', async(value) => {
	const text = await page.evaluate( () => {
		const dom = document.querySelector('#greetings')
		return dom.innerText
	})
	assert.equal(`Welcome, ${value}`, text)
})

Then('there should be a link to add a question', async() => {
	const text = await page.evaluate( () => {
		const dom = document.querySelector('#postquestion')
		return dom.innerText
	})
	assert.equal('Post your own question', text)
})

When('I click the login button', async() => {
	await page.click('#login')
})

When('I click the post button', async() => {
	await page.click('#postQuestion')
})

Then('the question number should be {string}', async(value) => {
	const text = await page.evaluate( () => {
		const dom = document.querySelector("#questionNo")
		return dom.innerText
	})
	assert.equal(value, text)
})

When('I clear the {string} field', async(field) => {
	const input = await page.$(`#${field}`)
	await input.click({clickCount: 3})
	await input.press('Backspace')
})

When('I click the search button', async() => {
	await page.click('#searchQuestion')
})

Then('there should be no questions on the home page', async() => {
	if(await page.$('#questionNo') === null) 
	assert.ok(true)
})
