'use strict'
const question = require('../modules/question')
const database = 'database.db'
const submitImage = require('../modules/submitImage')
const shortid = require('shortid')
const mime = require('mime-types')
const fs = require('fs-extra')

module.exports.AddAQuestion = async ctx => {
	try {
		const Question = await new question(database)
		const body = ctx.request.body
		const checkAttachment = await this.checkUpload(ctx)
		if (checkAttachment.checkAttachment === true) {
			await this.image(ctx, Question, checkAttachment.realPath, checkAttachment.path, body)
		} else if (checkAttachment.checkAttachment === 'none') {
			await this.noImage(ctx, Question, body)
		}
	} catch (err) {
		ctx.app.emit('error', err, ctx)
	}
}

module.exports.checkUpload = async ctx => {
	const checkAttachment = submitImage.validate(
		mime.extension(ctx.request.files.image.type)
	)
	if (
		checkAttachment.message ===
    'We do not support uploading images in this format'
	)
		throw new Error('We do not accept this format')
	const path = `/images/${shortid.generate()}.${mime.extension(
		// path needs to be defined after validation.
		ctx.request.files.image.type
	)}`
	const realPath = `public${path}`
	return { checkAttachment, path, realPath }
}

module.exports.noImage = async(ctx, Question, body) => {
	const path = null
	await Question.addQuestion(
		body.question,
		body.details,
		path,
		ctx.session.username
	)
	ctx.redirect('/')
}

module.exports.image = async(ctx, Question, realPath, path, body) => {
	await fs.copy(ctx.request.files.image.path, realPath)
	await Question.addQuestion(
		body.question,
		body.details,
		path,
		ctx.session.username
	)
	ctx.redirect('/')
}
