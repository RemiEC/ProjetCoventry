'use strict'
const User = require('../modules/user')

const database = 'database.db'

module.exports = async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(database)
		await user.subscore(body.author)
		const url = `/question/${body.questionId}`
		await ctx.redirect(url)
	} catch (err) {
		ctx.app.emit('error', ctx, err)
	}
}
