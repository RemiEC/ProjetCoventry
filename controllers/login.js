'use strict'
const User = require('../modules/user')
const database = 'database.db'

module.exports = async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(database)
		await user.login(body.user, body.pass)
		ctx.session.username = body.user
		ctx.session.path = await user.getPP(body.user)
		ctx.session.path = ctx.session.path.path
		return ctx.redirect('/')
	} catch (err) {
		ctx.app.emit('error', err, ctx)
	}
}
