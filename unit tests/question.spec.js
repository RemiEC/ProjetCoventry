'use strict'

const Questions = require('../modules/question.js')

describe('add questions', () => {
	test('adding a question with all arguments', async done => {
		expect.assertions(1)
		const question = await new Questions()
		const insert = await question.addQuestion('What is the time?', 'I can not see. Please, I need your help',
			'public/images/cat.png', 'doej')
		expect(insert).toBe(true)
		done()
	})

	test('adding a question without an image', async done => {
		expect.assertions(1)
		const question = await new Questions()
		const insert = await question.addQuestion('What is the time?', 'I can not see. Please, I need your help',
			null, 'doej')
		expect(insert).toBe(true)
		done()
	})

	test('adding question without question text throws an error', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect(question.addQuestion('', 'I can not see. Please, I need your help', 'public/images/cat.png',
			'doej')).rejects.toEqual(Error('There is no question'))
		done()
	})

	test('adding question without descript text throws an error', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect(question.addQuestion('What is the time?', '',
			'public/images/cat.png', 'doej')).rejects.toEqual(Error('There is no description'))
		done()
	})

	test('adding question without username throws an error', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect(question.addQuestion('What is the time?', 'I can not see. Please, I need your help',
			'public/images/cat.png', '')).rejects.toEqual(Error('There is no user'))
		done()
	})
})

describe('returning all questions', () => {
	test('returns every question from database', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('What is the time?', 'I can not see. Please, I need your help',
			'public/images/cat.png', 'doej')
		const records = await question.allQuestions()
		expect(records.length).toBe(1)
		done()
	})

	test('if there are no questions, an error should be thrown', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await expect(question.allQuestions()).rejects.toEqual(Error('There are no questions'))
		done()
	})
})

describe('searching for questions', () => {
	test('returns all questions matching the query text', async done => {
		expect.assertions(1)
		const question = await new Questions()
		await question.addQuestion('What is the time?', 'I can not see. Please, I need your help',
			'public/images/cat.png', 'doej')
		await question.addQuestion('What colour is this?', 'I think it is purple. Maybe pink?',
			'public/images/purple.png', 'doej')
		const record = await question.searchQuestion('colour')
		expect(record.length).toBe(1)
		done()
	})

	test('returning a question without ID or query should throw an error', async done => {
		expect.assertions(1)
		const question = await new Questions()
 		await question.addQuestion('What is the time?', 'I can not see. Please, I need your help',
			'public/images/cat.png', 'doej')
		await question.addQuestion('What colour is this?', 'I think it is purple. Maybe pink?',
			'public/images/purple.png', 'doej')
		await expect(question.searchQuestion('')).rejects.toEqual(Error('There are no search terms provided'))
		done()
	})
})
