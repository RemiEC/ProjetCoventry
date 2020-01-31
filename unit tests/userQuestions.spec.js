'use strict'

const userQuestions = require('../modules/userQuestions.js')

describe('add users and questions to link table', () => {
	test('adding user and questions with all arguments', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await uq.__createTestDB()
		const insert = await uq.addUserQuestion('jeod', 2)
		expect(insert).toBe(true)
		done()
	})

	test('adding users and questions without username throws an error', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await uq.__createTestDB()
		await expect(uq.addUserQuestion('', 1)).rejects.toEqual(Error('There is no user'))
		done()
	})

	test('adding users and questions without questionID throws an error', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await uq.__createTestDB()
		await expect(uq.addUserQuestion('doej', '')).rejects.toEqual(Error('There is no questionID'))
		done()
	})
})

describe('returning user questions', () => {
	test('return every user question from the database', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await uq.__createTestDB()
		const records = await uq.allUserQuestions()
		expect(records.length).toBe(3)
		done()
	})

	test('if there are no user questions, an error should be thrown', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await expect(uq.allUserQuestions()).rejects.toEqual(Error('There are no user questions'))
		done()
	})
})

describe('searching for questions in the database', () => {
	test('search for questions using the query text', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await uq.__createTestDB()
		const record = await uq.searchUserQuestion('time')
		expect(record.length).toBe(1)
		done()
	})

	test('searching for questions without query should throw an error', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await expect(uq.searchUserQuestion('')).rejects.toEqual(Error('There are no search terms provided'))
		done()
	})
})

describe('returning a single question from the database', () => {
	test('return a question using the questionID', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await uq.__createTestDB()
		const record = await uq.oneUserQuestion(1)
		expect(Object.keys(record).length).toBe(10)
		done()
	})

	test('returning one question without questionID should throw an error', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await expect(uq.oneUserQuestion('')).rejects.toEqual(Error('There is no questionID'))
		done()
	})
})

describe('checking if questions are solved', () => {
	test('question with a correct answer should be marked as solved', async done => {
		expect.assertions(1)
		const uq = await new userQuestions.userQuestion()
		await uq.__createTestDB()
		const record = await uq.searchUserQuestion('time')
		const question = record[0]
		const checkedQuestion = await userQuestions.isSolved(':memory:', question, true)
		expect(checkedQuestion.solved).toBe(true)
		done()
	})

	test('question with a correct answer should be marked as solved', async done => {
		const uq = await new userQuestions.userQuestion()
		await uq.__createTestDB()
		await uq.addUserQuestion('abcd', 2)
		const record = await uq.searchUserQuestion('colour')
		const question = record[0]
		const checkedQuestion = await userQuestions.isSolved(':memory:', question, true)
		expect(checkedQuestion.solved).toBe(false)
		done()
	})

	test('no questions in the database should throw an error', async done => {
		expect.assertions(1)
		await expect(userQuestions.isSolved(':memory:', '', true)).rejects.toEqual(Error('There are no questions'))
		done()
	})
})
