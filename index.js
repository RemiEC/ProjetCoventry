#!/usr/bin/env node
'use strict'
/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' })
const session = require('koa-session')
/* IMPORT CUSTOM MODULES */
const app = new Koa()
const router = new Router()
const Home = require('./controllers/home')
const OffTopic = require('./controllers/offtopic')
const AddAQuestion = require('./controllers/addaquestion')
const AddAnAnswer = require('./controllers/addananswer')
const Register = require('./controllers/register')
const Login = require('./controllers/login')
const QuestionDetails = require('./controllers/question-details')
const Correct = require('./controllers/correct')
const Rate = require('./controllers/rate')
/* IMPORT DATABASE CLASSES TO CREATE TABLES*/
const userAnswers = require('./modules/userAnswers')
const correctAnswers = require('./modules/correctAnswer')
/* CALL DATABASE CONSTRUCTORS */
new userAnswers('database.db')
new correctAnswers('database.db')
/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(
	views(
		`${__dirname}/views`,
		{ extension: 'handlebars' },
		{ map: { handlebars: 'handlebars' } }
	)
)
app.on('error', async(err, ctx) => {
	console.log(`Error message received: ${err} at ${ctx.url}`)
	let url = `${ctx.url}`
	url = url.slice(1)
	const query = err.message
	if (url.includes('?')) {
		// checks for other paramaters in url
		await ctx.redirect(`${url}&error=${query}`)
	} else await ctx.redirect(`${url}?error=${query}`)
})

const defaultPort = 8080
const port = process.env.PORT || defaultPort
/**
 * Displays list of questions with ability to search them.
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	let error
	if (ctx.query.error) error = decodeURIComponent(ctx.query.error)
	await Home.home(ctx, error)
})
/**
 * The page where a user can submit a question.
 * @name Add Question Page
 * @route {GET} /addaquestion
 */
router.get('/addaquestion', async ctx => {
	let error
	if (ctx.query.error) error = decodeURIComponent(ctx.query.error)
	await ctx.render('addaquestion', {
		name: ctx.session.username,
		error: error
	})
})
router.post('/correct', async ctx => {
	await Correct(ctx)
})
router.post('/offtopic', async ctx => {
	await OffTopic(ctx)
})

router.post('/rate', async ctx => {
	await Rate(ctx)
})
/**
 * Submit a question.
 * @name Submit a Question
 * @route {POST} /addaquestion
 */
router.post('/addaquestion', koaBody, async ctx => {
	await AddAQuestion.AddAQuestion(ctx)
})
/**
 * Submit an answer.
 * @name Submit an Answer
 * @route {POST} /addanswer
 */
router.post('/addanswer', async ctx => {
	await AddAnAnswer(ctx)
})
/**
 * The user registration page.
 *
 * @name Registration
 * @route {GET} /register
 */
router.get('/register', async ctx => {
	let error
	if (ctx.query.error) error = decodeURIComponent(ctx.query.error)
	await ctx.render('register', {
		error: error
	})
})
/**
 * Register a new account.
 *
 * @name Register Account
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	await Register(ctx)
})
/**
 * The user login page.
 * @name Login Page
 * @route {GET} /login
 */
router.get('/login', async ctx => {
	let error
	if (ctx.query.error) error = decodeURIComponent(ctx.query.error)
	await ctx.render('login', { error: error })
})
/**
 * Login to user account.
 * @name Login
 * @route {POST} /login
 */
router.post('/login', async ctx => {
	await Login(ctx)
})
/**
 * Display a question detail page
 * @name Question Detail Page
 * @route {GET} /question/:id
 * @routeparam {Integer} :id is the unique identifier for the question to display the detail page for.
 */
router.get('/question/:id', koaBody, async ctx => {
	let error
	if (ctx.query.error) error = decodeURIComponent(ctx.query.error)
	await QuestionDetails(ctx, error)
})
/**
 * Logout of user account.
 * @name Logout
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	ctx.session.username = null
	ctx.session.path = null
	ctx.redirect('/')
})
app.use(router.routes())
module.exports = app.listen(port, async() =>
	console.log(`listening on port ${port}`)
)
/**
 * Used to increment the value of index
 * @index Displays the index of the question
 */
const Handlebars = require('handlebars')
Handlebars.registerHelper('inc', value => parseInt(value) + 1)

Handlebars.registerHelper('displayRating', (username, askerUsername, options) => {
	if (username===null || username===askerUsername) return options.fn(this)
	return options.inverse(this)
})
