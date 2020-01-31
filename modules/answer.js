'use strict'

const sqlite = require('sqlite-async')
const UserAnswers = require('./userAnswers.js')
const QuestionAnswers = require('./questionAnswers.js')

/**
 * @fileoverview An answers file that's primarily used to add answers to a database. Retrieving data
 * is supported but not reccomended as there are other files with methods more suited to the task.
 */

/**
 * A class that represents an answer with methods to read and write answers to a database.
 */
class Answer {
	/**
     * Creates the answers table in the database.
     * @param {string} [dbName = :memory:] - The file path to the database. By default it creates a database in memory.
     */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS answers (
				answerID INTEGER PRIMARY KEY AUTOINCREMENT,
				answer TEXT,
				inappropriate INTEGER DEFAULT 0,
				dateAdded TEXT
			);`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Adds an answer to the database.
	 * @param {string} answer - The title of the answer.
	 * @param {integer} inappropriate - Whether an answer is inappropiate (1) or not (0).
	 * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
	 * @throws Will throw an error if the answer, user or questionID is ''.
	 */
	async addAnswer(answer, inappropriate, user, questionID) {
		try {
			if(answer === '') throw new Error('There is no answer')
			if(user === '') throw new Error('There is no user')
			if(questionID === '') throw new Error('There is no questionID')
			let sql = `INSERT into answers(answer, inappropriate, dateAdded) 
				VALUES("${answer}", "${inappropriate}", datetime("now"))`
			await this.db.run(sql)
			sql = 'SELECT last_insert_rowid()'
			const answerID = await this.db.run(sql) // retrieves the last answerID inserted into the database
			const ua = await new UserAnswers(this.db.filename)
			await ua.addUserAnswer(user, answerID.lastID)
			const qa = await new QuestionAnswers(this.db.filename)
			await qa.addQuestionAnswer(questionID, answerID.lastID)
			return true
		} catch (err) {
			throw err
		}
	}

	/**
     * @typedef {Object} answerData
     * @property {integer} answerID - The ID of the answer.
     * @property {string} answer - The answer text.
     * @property {integer} inappropiate - Whether an answer is inappropiate (1) or not (0).
     * @property {string} dateAdded - The date and time the question was answered.
     */

	/**
     * Retrieves all the answers in the database.
     * @returns {Promise<Array<answerData>>} Array containing all the answers in the database.
     */
	async allAnswers() {
		try {
			const sql = 'SELECT * FROM answers'
			const data = await this.db.all(sql)
			if (data.length === 0) throw new Error('There are no answers')
			return data
		} catch (err) {
			throw err
		}
	}

	/**
     * Retrieves one answer from the database that matches the search queries.
     * @param {integer} id - The ID of the answer to be searched.
     * @returns {Promise<answerData>} The answer that matched the search query.
     */
	async oneAnswer(id) {
		try {
			if (id === '') {
				throw new Error('There is no search term provided')
			}
			const sql = `SELECT * FROM answers WHERE answerID="${id}"`
			const data = await this.db.get(sql)
			return data
		} catch (err) {
			throw err
		}
	}
}

module.exports = Answer
