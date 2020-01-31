'use strict'
const Answer = require('../modules/answer')
const database = 'database.db'

module.exports = async ctx => {
	try {
		const body = ctx.request.body
		const url = `/question/${body.questionId}`
		ctx.url = url
		const answer = await new Answer(database)
		await answer.addAnswer(
			body.answer,
			ctx.session.path,
			ctx.session.username,
			body.questionId
		)
		await ctx.redirect(url)
	} catch (err) {
		ctx.app.emit('error', err, ctx)
	}
}
