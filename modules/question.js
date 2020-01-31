'use strict'

const sqlite = require('sqlite-async')
const UserQuestions = require('./userQuestions.js')

/**
 * @fileoverview A questions file that's primarily used to add questions to a database. Retrieving data
 * is supported but not reccomended as there are other files with methods more suited to the task.
 */

/**
 * A class that represents a question with methods to read and write questions to a database.
 */
class Question {
	/**
     * Creates the questions table in the database.
	 * @param {string} [dbName = :memory:] - The file path to the database. By default it creates a database in memory.
	 */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS questions (
				questionID INTEGER PRIMARY KEY AUTOINCREMENT,
				question TEXT,
				descript TEXT,
				screenshotPath TEXT,
				dateAdded TEXT
			);`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Adds a question to the database.
     * @param  {string} question - The title of the question.
     * @param  {string} descript - The description of the question.
     * @param  {string} scPath - The path to the screenshot attached to the question.
     * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
     * @throws Will throw an error if either question, descript or user are ''.
     */
	async addQuestion(question, descript, scPath, user) {
		try {
			await this.checkParams(question, descript, user)
			let sql = ''
			if (scPath !== null)
				sql = `INSERT INTO questions(question, descript, screenshotPath, dateAdded) 
				VALUES("${question}", "${descript}", "${scPath}", datetime("now"))`
			if (scPath === null)
				sql = `INSERT INTO questions(question, descript, dateAdded) 
			VALUES("${question}", "${descript}", datetime("now"))`
			await this.db.run(sql)
			sql = 'SELECT last_insert_rowid()'
			const questionID = await this.db.run(sql) // retrieves the last questionID inserted into the database
			const uq = await new UserQuestions.userQuestion(this.db.filename)
			await uq.addUserQuestion(user, questionID.lastID)
			return true
		} catch (err) {
			throw err
		}
	}

	/**
	 * Checks whether question, descript or scPath have a value.
     * @param  {string} question - The title of the question.
     * @param  {string} descript - The description of the question.
     * @param  {string} scPath - The path to the screenshot attached to the question.
     * @throws Will throw an error if either question, descript or user are ''.
	 */
	async checkParams(question, descript, user) {
		try {
			if (question === '') throw new Error('There is no question')
			if (descript === '') throw new Error('There is no description')
			if (user === '') throw new Error('There is no user')
		} catch (err) {
			throw err
		}
	}

	/**
     * @typedef {Object} questionData
     * @property {integer} questionID - The ID of the question.
     * @property {string} question - The title of the question.
     * @property {string} descript - The description of the question.
     * @property {string} screenshotPath - The path to the screenshot attached to the question.
     * @property {integer} correctAnswerID - The ID of the correct answer for the question.
     * @property {string} dateAdded - The date and time the question was asked.
     * @property {boolean} solved - Determines whether the question has a correct answer.
     */

	/**
     * Retrieves all the questions in the database.
     * @returns {Promise<Array<questionData>>} Array containing all the questions in the database.
	 */
	async allQuestions() {
		try {
			const sql = 'SELECT * FROM questions'
			const data = await this.db.all(sql)
			if (data.length === 0) throw new Error('There are no questions')
			return data
		} catch (err) {
			throw err
		}
	}

	/**
	 * Retrieves all questions from the database that matches the search query.
     * @param {integer} id - The ID of the question to be searched.
     * @param {string} query - The title of the question to be searched.
     * @returns {Promise<questionData>} The question that matched the search query.
     */
	async searchQuestion(query) {
		try {
			if (query === '') {
				throw new Error('There are no search terms provided')
			}
			const sql = `SELECT * FROM questions WHERE question LIKE "%${query}%"`
			const data = await this.db.all(sql)
			return data
		} catch (err) {
			throw err
		}
	}
}

module.exports = Question
