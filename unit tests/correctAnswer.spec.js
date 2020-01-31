'use strict'

const correctAnswers = require('../modules/correctAnswer.js')

describe('adding questions with their correct answer to link table', () => {
	test('adding question with correct answer using all arguments', async done => {
		expect.assertions(1)
		const ca = await new correctAnswers()
		await ca.__createTestDB()
		const insert = await ca.addCorrectAnswer(1, 2)
		expect(insert).toBe(true)
		done()
	})

	test('adding users and questions without questionID throws an error', async done => {
		expect.assertions(1)
		const ca = await new correctAnswers()
		await ca.__createTestDB()
		await expect(ca.addCorrectAnswer('', 1)).rejects.toEqual(Error('There is no questionID'))
		done()
	})

	test('adding questions and answers without answerID throws an error', async done => {
		expect.assertions(1)
		const ca = await new correctAnswers()
		await ca.__createTestDB()
		await expect(ca.addCorrectAnswer(1, '')).rejects.toEqual(Error('There is no answerID'))
		done()
	})
})

describe('returning correct answers', () => {
	test('return a correct answer to a question from the database', async done => {
		expect.assertions(1)
		const ca = await new correctAnswers()
		await ca.__createTestDB()
		const record = await ca.oneCorrectAnswer(1)
		expect(Object.keys(record).length).toBe(1)
		done()
	})

	test('returning question answers without questionID should throw an error', async done => {
		expect.assertions(1)
		const ca = await new correctAnswers()
		await expect(ca.oneCorrectAnswer('')).rejects.toEqual(Error('There is no questionID'))
		done()
	})
})
