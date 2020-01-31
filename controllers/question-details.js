'use strict'
const userQuestions = require('../modules/userQuestions')
const AnswerData = require('../modules/answerData')
const database = 'database.db'

module.exports = async(ctx, err) => {
	try {
		const UserQuestions = await new userQuestions.userQuestion(database)
		const data = await UserQuestions.oneUserQuestion(ctx.params.id)
		const answerData = await AnswerData(ctx.params.id, database)
		let poster = null
		if (ctx.session.username === data.user) poster = 'author'
		await ctx.render('qdetails', {
			question: data,
			answer: answerData,
			name: ctx.session.username,
			poster: poster,
			error: err
		})
	} catch (err) {
		ctx.app.emit('error', err, ctx)
	}
}
