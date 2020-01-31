'use strict'

const Accounts = require('../modules/user.js')
const mock = require('mock-fs')
const fs = require('fs')

beforeAll(() => {
	const imageBuffer = fs.readFileSync('unit\ tests/images/avatar.png')
	mock({
		'public/tests/avatar.png': imageBuffer
	})
})

afterAll(() => {
	mock.restore()
})

describe('register()', () => {
	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		const register = await account.register('simon', 'password', 'png', 'public/tests/avatar.png')
		expect(register).toBe(true)
		done()
	})

})


describe('testforthrow', () => {
	test('accept a valid combination', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		const result = await account.testforthrow('bob', 'password', 'png')
		 expect(result).toBe(true)
		done()
	})

	test('error if type not in png or jpeg', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect(account.testforthrow('bob', 'password', 'pdf')).rejects.toEqual(
			Error('We do not accept this format')
		)
		done()
	})

	test('error if no file is selected (bin type appears when no file is submitted)', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect(account.testforthrow('doej', 'password', 'bin')).rejects.toEqual(
			Error('missing avatar')
		)
		done()
	})


})

describe('testuserandpass', () => {
	test('accept a valid combination', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		const result = await account.testuserandpass('bob', 'password')
		 expect(result).toBe(true)
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect(account.testuserandpass('', 'password')).rejects.toEqual(
			Error('missing username')
		)
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect(account.testuserandpass('doej', '')).rejects.toEqual(
			Error('missing password')
		)
		done()
	})


})


describe('upload', () => {
	test('accept a valid combination', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		const result = await account.upload('bob', 'password', 'png', 'public/tests/avatar.png')
		 expect(result).toBe(true)
		done()
	})


	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await account.upload('bob', 'password','png', 'public/tests/avatar.png')
		await expect(account.upload('bob', 'password','png', 'public/tests/avatar.png')).rejects.toEqual(
			Error('username "bob" already in use')
		)
		done()
	})

})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await account.register('sam', 'password', 'png', 'public/tests/avatar.png')
		const valid = await account.login('sam', 'password')
		expect(valid).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await account.register('joe', 'password', 'png', 'public/tests/avatar.png')
		await expect(account.login('roej', 'password')).rejects.toEqual(
			Error('invalid username "roej"')
		)
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await account.register('simon', 'password', 'png', 'public/tests/avatar.png')
		await expect(account.login('simon', 'bad')).rejects.toEqual(
			Error('invalid password for account "simon"')
		)
		done()
	})
})

describe('getPP', () => {

	test('get avatarpath of a registered user', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await account.register('simon', 'password', 'png', 'public/tests/avatar.png')
		const result =await account.getPP('simon')
		expect(result.avatarPath.length).toBeGreaterThan(0)
		done()
	})

	test('error with unregistered user', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		const result =await account.getPP('unregistered')
		expect(result).toBe(undefined)
		done()
	})

})


describe('addscore', () => {

	test('addscore of registered user', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await account.register('addscore', 'password', 'png', 'public/tests/avatar.png')
		const result =await account.addscore('addscore')
		expect(result).toBe(true)
		done()
	})

	test('error with blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect(account.addscore('')).rejects.toEqual(
			Error('User does not exist')
		)
		done()
	})

})

describe('subscore', () => {

	test('subscore of registered user', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await account.register('subscore', 'password', 'png', 'public/tests/avatar.png')
		const result =await account.subscore('subscore')
		expect(result).toBe(true)
		done()
	})

	test('error with blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()

		await expect(account.subscore('')).rejects.toEqual(
			Error('User does not exist')
		)
		done()
	})

})
