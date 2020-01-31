'use strict'
const User = require('../modules/user')
const markCorrect = require('../modules/markCorrect')
const database = 'database.db'

/**
 * @module
 */

/**
 * Fetch either a single question, multiple questions according to a query or all questions depending on params passed.
 * @param {string} database The database file path
 * @param {integer} id The unique answer ID to fetch (if data for a single question is required)
 * @param {string} query The query string used to search the database (if a query was made through home page)
 * @returns {object} The data for the question(s)
 */
module.exports = async ctx => {
	try {
		const body = ctx.request.body
		const url = `/question/${body.questionId}`
		ctx.url = url
		const already = await markCorrect(database, body.answerId, body.questionId)
		if (already === false) {
			ctx.url = `/question/${body.questionId}`
			const errorCode = 400
			ctx.throw(errorCode, 'An answer has already been marked as correct')
		} else {
			const user = await new User(database)
			await user.addscore(body.author)
		}
		await ctx.redirect(url)
	} catch (err) {
		ctx.app.emit('error', err, ctx)
	}
}
