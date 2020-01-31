'use strict'

const sqlite = require('sqlite-async')
const testDatabase = require('./dummyData.js')

/**
 * @fileoverview A file that's primarily used to retrieve users with their answers to a database. Adding answers
 * with their users is a dependancy for answer.js and should not be used by other files or classes unless necessary.
 */

/**
 * A class that represents answers with the users who posted them with methods to read and write answers and users
 * to a database.
 */
class userAnswer {
	/**
     * Creates the link table between users and answers in the database.
     * @param {string} [dbName = :memory:] - The file path to the database. By default it creates a database in memory.
     */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS users (user TEXT PRIMARY KEY, pass TEXT,
				avatarPath TEXT, score INTEGER DEFAULT 0);`
			const sql1 = `CREATE TABLE IF NOT EXISTS answers (answerID INTEGER PRIMARY KEY AUTOINCREMENT,
				answer TEXT, inappropriate INTEGER DEFAULT 0, dateAdded TEXT);`
			const sql2 = `CREATE TABLE IF NOT EXISTS UserAnswers (user TEXT, answerID INTEGER,
				FOREIGN KEY (user) REFERENCES users (user)
				FOREIGN KEY (answerID) REFERENCES answers (answerID)
				PRIMARY KEY (user, answerID)
			);`

			await this.db.run(sql)
			await this.db.run(sql1)
			await this.db.run(sql2)
			return this
		})()
	}

	/**
	 * Adds a username and answerID to the database.
	 * @param {string} user - The username of who posted the question.
	 * @param {integer} answerID - The ID of the answer that was posted.
	 * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
	 * @throws Will throw an error if either user or answerID are ''.
	 */
	async addUserAnswer(user, answerID) {
		try {
			if(user === '') throw new Error('There is no user')
			if(answerID === '') throw new Error('There is no answerID')
			const sql = `INSERT INTO UserAnswers VALUES("${user}", ${answerID});`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	/**
     * @typedef {Object} userAnswerData
     * @property {string} user - The username of the user.
     * @property {string} pass - The user's password.
     * @property {string} avatarPath - The user's profile picture directory path.
     * @property {integer} score - The user's score.
     * @property {integer} answerID - The ID of the answer.
     * @property {string} answer - The answer text.
     * @property {integer} inappropiate - Whether an answer is inappropiate (1) or not (0).
     * @property {string} dateAdded - The date and time the question was answered.
	 * @property {boolean} gold - Determines whether the user has a score higher than 5 than the userbase.
	 * @property {boolean} silver - Determines whether the user has a score higher than 25% than the userbase.
	 * @property {boolean} bronze - Determines whether the user has a score higher than 50% than the userbase.
     */

	/**
     * Retrieves all the questions with their users in the database.
     * @returns {Promise<Array<userAnswerData>>} Array containing all the questions with their users in the database.
     */
	async allUserAnswers() {
		try {
			const sql =
        'SELECT * FROM users, answers JOIN UserAnswers USING (user, answerID);'
			const data = await this.db.all(sql)
			if (data.length === 0) throw new Error('There are no user questions')
			return data
		} catch (err) {
			throw err
		}
	}

	/**
     * Creates a database to be used for unit testing ONLY.
     */
	async __createTestDB() {
		const testArray = await testDatabase()
		for (const sql of testArray) {
			await this.db.run(sql)
		}
	}
}

module.exports = userAnswer
