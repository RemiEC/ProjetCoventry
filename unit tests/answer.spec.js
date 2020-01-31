'use strict'

const Answers = require('../modules/answer.js')

describe('adding answers', () => {
	test('adding an answer with all arguments', async done => {
		expect.assertions(1)
		const answer = await new Answers()
		const insert = await answer.addAnswer(
			'It is 10 past 10 at night.',
			1,
			'doej',
			1
		)
		expect(insert).toBe(true)
		done()
	})

	test('adding and answer without answer text should throw an error', async done => {
		expect.assertions(1)
		const answer = await new Answers()
		await expect(answer.addAnswer('', 1, 'doej', 1)).rejects.toEqual(Error('There is no answer'))
		done()
	})

	test('adding and answer without user should throw an error', async done => {
		expect.assertions(1)
		const answer = await new Answers()
		await expect(answer.addAnswer('It is 10 past 10 at night.', 1, '', 1))
			.rejects.toEqual(Error('There is no user'))
		done()
	})

	test('adding and answer without questionID should throw an error', async done => {
		expect.assertions(1)
		const answer = await new Answers()
		await expect(answer.addAnswer('It is 10 past 10 at night.', 1, 'doej', ''))
			.rejects.toEqual(Error('There is no questionID'))
		done()
	})
})

describe('returning all answers', () => {
	test('return every answer from the database', async done => {
		expect.assertions(1)
		const answer = await new Answers()
		await answer.addAnswer('It is 10 past 10 at night.', 1, 'doej', 1)
		const records = await answer.allAnswers()
		expect(records.length).toBe(1)
		done()
	})

	test('if there are no answers, an error should be thrown', async done => {
		expect.assertions(1)
		const answer = await new Answers()
		await expect(answer.allAnswers()).rejects.toEqual(
			Error('There are no answers')
		)
		done()
	})
})

describe('returning a single answer', () => {
	test('returns an answer using answer ID', async done => {
		expect.assertions(1)
		const answer = await new Answers()
		await answer.addAnswer('It is 10 past 10 at night.', 1, 'doej', 1)
		await answer.addAnswer('It is 15 past 10 at night.', 0, 'doej', 1)
		const record = await answer.oneAnswer(1)
		expect(Object.keys(record).length).toBe(4)
		done()
	})

	test('returning a question without ID or query should throw an error', async done => {
		expect.assertions(1)
		const answer = await new Answers()
		await answer.addAnswer('It is 10 past 10 at night.', 1, 'doej', 1)
		await answer.addAnswer('It is 15 past 10 at night.', 0, 'doej', 1)
		await expect(answer.oneAnswer('')).rejects.toEqual(Error('There is no search term provided'))
		done()
	})
})
