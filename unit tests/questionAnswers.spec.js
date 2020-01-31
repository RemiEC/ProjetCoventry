'use strict'

const questionAnswers = require('../modules/questionAnswers.js')

describe('add question and answers to link table', () => {
	test('adding question and answers with all arguments', async done => {
		expect.assertions(1)
		const qa = await new questionAnswers()
		await qa.__createTestDB()
		const insert = await qa.addQuestionAnswer(1, 2)
		expect(insert).toBe(true)
		done()
	})

	test('adding users and questions without questionID throws an error', async done => {
		expect.assertions(1)
		const ua = await new questionAnswers()
		await ua.__createTestDB()
		await expect(ua.addQuestionAnswer('', 1)).rejects.toEqual(Error('There is no questionID'))
		done()
	})

	test('adding questions and answers without answerID throws an error', async done => {
		expect.assertions(1)
		const ua = await new questionAnswers()
		await ua.__createTestDB()
		await expect(ua.addQuestionAnswer(1, '')).rejects.toEqual(Error('There is no answerID'))
		done()
	})
})

describe('returning user answers', () => {
	test('return every question answer from the database', async done => {
		expect.assertions(1)
		const qa = await new questionAnswers()
		await qa.__createTestDB()
		const records = await qa.allQuestionAnswers(1)
		expect(records.length).toBe(1)
		done()
	})

	test('returning question answers without questionID should throw an error', async done => {
		expect.assertions(1)
		const qa = await new questionAnswers()
		await expect(qa.allQuestionAnswers('')).rejects.toEqual(Error('There is no questionID'))
		done()
	})
})
