'use strict'

const answerData = require('../modules/answerData.js')
const userAnswers = require('../modules/userAnswers.js')

describe('returning correct and incorrect answers to a question', () => {
	test('return answers details', async done => {
		expect.assertions(7)
		const ua = await new userAnswers()
		await ua.__createTestDB()
		const records = await ua.allUserAnswers()
		const result = await answerData(1,':memory:', true)
		expect(result[0].correct).toBe(true)
		expect(result[0].gold).toBe(true)
		expect(result[0].avgStars).toBe(3)
		delete result[0].avgStars
		delete result[0].gold
		delete result[0].correct
		expect(result[0]).toEqual(records[0])
		expect(result[1].gold).toBe(true)
		expect(result[1].avgStars).toBe(0)
		delete result[1].avgStars
		delete result[1].gold
		delete result[1].correct
		expect(result[1]).toEqual(records[2])

		done()
	})

	test('empty array if they are no answers', async done => {
		expect.assertions(1)
		const result = await answerData(3,':memory:', true)
		expect(result.length).toBe(0)
		done()
	})

	test('without a correct answer', async done => {
		expect.assertions(4)
		const ua = await new userAnswers()
		await ua.__createTestDB()
		const records = await ua.allUserAnswers()
		const result = await answerData(2, ':memory:', true)
		expect(result[0].correct).toBe(undefined)
		expect(result[0].gold).toBe(true)
		expect(result[0].avgStars).toBe(0)
		delete result[0].avgStars
		delete result[0].gold
		delete result[0].correct
		expect(result[0]).toEqual(records[3])

		done()
	})
})
