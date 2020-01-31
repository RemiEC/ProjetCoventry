'use strict'

const testDatabase = require('../modules/dummyData.js')

describe('add users and questions to link table', () => {
	test('add dummy data to the database', async done => {
		expect.assertions(1)
		const testDB = await testDatabase()
		await expect(testDB.length).toBe(33)
		done()
	})
})
