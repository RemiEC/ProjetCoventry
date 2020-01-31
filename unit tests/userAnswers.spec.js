'use strict'

const userAnswers = require('../modules/userAnswers.js')

describe('add users and answer to link table', () => {
	test('adding answer with all arguments', async done => {
		expect.assertions(1)
		const ua = await new userAnswers()
		await ua.__createTestDB()
		const insert = await ua.addUserAnswer('doej', 3)
		expect(insert).toBe(true)
		done()
	})

	test('adding users and answers without username throws an error', async done => {
		expect.assertions(1)
		const ua = await new userAnswers()
		await ua.__createTestDB()
		await expect(ua.addUserAnswer('', 1)).rejects.toEqual(Error('There is no user'))
		done()
	})

	test('adding users and answers without answerID throws an error', async done => {
		expect.assertions(1)
		const ua = await new userAnswers()
		await ua.__createTestDB()
		await expect(ua.addUserAnswer('doej', '')).rejects.toEqual(Error('There is no answerID'))
		done()
	})
})

describe('returning user answers', () => {
	test('return every user answer from the database', async done => {
		expect.assertions(1)
		const ua = await new userAnswers()
		await ua.__createTestDB()
		const records = await ua.allUserAnswers()
		expect(records.length).toBe(4)
		done()
	})

	test('if there are no user questions, an error should be thrown', async done => {
		expect.assertions(1)
		const ua = await new userAnswers()
		await expect(ua.allUserAnswers()).rejects.toEqual(
			Error('There are no user questions')
		)
		done()
	})
})
