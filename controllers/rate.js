'use strict'

const Rate = require('../modules/getRating')
const database = 'database.db'

module.exports = async ctx => {
	try {
		const body = ctx.request.body
		const url = `/question/${body.questionId}`
		ctx.url = url
		const rate = await new Rate(database)
		await rate.addRate(ctx.session.username, body.answerId, body.stars)
		await ctx.redirect(url)
	} catch (err) {
		const rateAnsTwiceCode = 19
		if (err.errno === rateAnsTwiceCode) {
			err.message =
		'You have already rated this answer. You cannot rate it twice.'

		}

		ctx.app.emit('error', err, ctx)
	}
}
