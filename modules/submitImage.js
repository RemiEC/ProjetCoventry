'use strict'

/**
 * @module
 */
/**
 * Validate the file type of an image.
 * @param {string} fileExtension The extension of the file being tested
 * @returns { Boolean } true if file is of a valid type, or false if it is invalid
 * @returns { String } 'none' if no file is uploaded
 * @throws {UnprocessableEntityError} if file type is invalid
 */
module.exports.validate = fileExtension => {
	try {
		if (fileExtension === 'bin') {
			return 'none'
		} else if (fileExtension !== 'png' && fileExtension !== 'jpeg') {
			throw new Error('We do not support uploading images in this format')
		}
		return true
	} catch (err) {
		return err
	}
}
