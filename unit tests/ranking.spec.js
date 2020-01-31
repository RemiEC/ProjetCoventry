'use strict'

const ranking = require('../modules/ranking.js')
const userAnswers = require('../modules/userAnswers.js')

describe('returning user rankings', () => {
	test('Checking users in objects have the correct rank', async done => {
		expect.assertions(12)
		const ua = await new userAnswers()
		await ua.__createTestDB()
		const records = await ua.allUserAnswers()
		for (let record of records) {
			record = await ranking.getRankingObj(':memory:', record, true)
		}
		await expect(records[0].gold).toBe(true)
		await expect(records[0].silver).toBe(undefined)
		await expect(records[0].bronze).toBe(undefined)
		await expect(records[1].gold).toBe(undefined)
		await expect(records[1].silver).toBe(true)
		await expect(records[1].bronze).toBe(undefined)
		await expect(records[2].gold).toBe(undefined)
		await expect(records[2].silver).toBe(undefined)
		await expect(records[2].bronze).toBe(true)
		await expect(records[3].gold).toBe(undefined)
		await expect(records[3].silver).toBe(undefined)
		await expect(records[3].bronze).toBe(undefined)
		done()
	})
})
