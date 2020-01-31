'use strict'

const Rating = require('../modules/getRating.js')

describe('add rating', () => {
	test('adding a rate', async done => {
		expect.assertions(1)
		const rate = await new Rating()
		const insert = await rate.addRate('huj',
			2, 4)
		expect(insert).toBe(true)
		done()
	})

	test('adding a rate without the user should throw an error', async done => {
		expect.assertions(1)
		const rate = await new Rating()
		await expect(rate.addRate('doej', 2, undefined)
		).rejects.toEqual(Error('There is no star rating provided'))
		done()
	})
})
