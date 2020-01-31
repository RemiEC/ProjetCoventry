'use strict'

const submitImage = require('../modules/submitImage.js')

describe('validating if the format of the file is accepted', () => {


	test('validating files with .bin extension return none  ', async done => {
		expect.assertions(1)
		const result = submitImage.validate('bin')
		expect(result).toBe('none')
		done()
	})

	test('validating files with .png or .jpeg extension return true  ', async done => {
		expect.assertions(2)
		const result = submitImage.validate('jpeg')
		const result2 = submitImage.validate('png')
		expect(result).toBe(true)
		expect(result2).toBe(true)
		done()
	})

	test('validating files with a format different from .bin, .jpeg or .png return error  ', async done => {
		expect.assertions(1)
		const result = submitImage.validate('pdf')
		expect(result.message).toBe('We do not support uploading images in this format')
		done()
	})


})
