'use strict'
const User = require('../modules/user')
const database = 'database.db'
const mime = require('mime-types')

module.exports = async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(database)
		const filetype = mime.extension(ctx.request.files.image.type)
		const register = await user.register(body.user, body.pass, filetype, ctx.request.files.image.path)
		if(register) {
			await user.login(body.user, body.pass) // tries to login with inv username
			ctx.session.path = await user.getPP(body.user)
			ctx.session.path = ctx.session.path.path
			ctx.session.username = body.user
			ctx.redirect('/')
		}
	} catch (err) {
		await ctx.app.emit('error', err, ctx)
	}
}
