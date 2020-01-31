'use strict'
const database = 'database.db'
const userQuestions = require('../modules/userQuestions')
module.exports.home = async(ctx, error) => {
	try {
		if (await this.checkForErrors(ctx, error) === true) return // causes redirect if you don't check it is true.
		const retrieveData = await this.retrieveData(ctx)
		await ctx.render('../views/mainpage', {
			listequestions: retrieveData.data,
			query: retrieveData.querystring,
			name: ctx.session.username,
			error: error
		})
	} catch (err) {
		ctx.app.emit('error', err, ctx)
	}
}

module.exports.retrieveData = async ctx => {
	let data = {}
	let querystring = ''
	const UserQuestions = await new userQuestions.userQuestion(database)
	if (ctx.query !== undefined && ctx.query.q !== undefined) {
		data = await UserQuestions.searchUserQuestion(ctx.query.q)
		querystring = ctx.query.q
	} else {
		data = await UserQuestions.allUserQuestions()
	}
	return { data: data, querystring: querystring }
}

module.exports.checkForErrors = async(ctx, error) => {
	if (error && error === 'There are no user questions') {
		await ctx.render('../views/mainpage', {
			name: ctx.session.username,
			error: error
		})
		return true
	}
	if (error && error === 'There are no search terms provided') {
		await ctx.render('../views/mainpage', {
			name: ctx.session.username,
			error: error
		})
		return true
	}
}
