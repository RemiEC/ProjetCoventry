'use strict'

const sqlite = require('sqlite-async')
const testDatabase = require('./dummyData.js')
const ranking = require('./ranking.js')

/**
 * @fileoverview A file that's primarily used to retrieve questions with their incorrect answers to a database. Adding
 * questions with their answers is a dependancy for question.js and should not be used by other files or classes unless
 * necessary.
 */

/**
 * A class that represents questions with their incorrect answers with methods to read and write questions and users
 * to a database.
 */
class questionAnswer {
	/**
     * Creates the link table between questions and their incorrect answers in the database.
     * @param {string} [dbName = :memory:] - The file path to the database. By default it creates a database in memory.
     */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS questions (questionID INTEGER PRIMARY KEY AUTOINCREMENT,
				question TEXT, descript TEXT, screenshotPath TEXT, dateAdded TEXT);`
			const sql1 = `CREATE TABLE IF NOT EXISTS answers (answerID INTEGER PRIMARY KEY AUTOINCREMENT,
				answer TEXT, inappropriate INTEGER DEFAULT 0, dateAdded TEXT);`
			const sql2 = `CREATE TABLE IF NOT EXISTS QuestionAnswers (questionID INTEGER, answerID INTEGER,
				FOREIGN KEY (answerID) REFERENCES answers (answerID) FOREIGN KEY (questionID) REFERENCES
				questions (questionID) PRIMARY KEY (questionID, answerID));`
			const sql3 = `CREATE TABLE IF NOT EXISTS UserRatings (user TEXT, answerID INTEGER, stars INTEGER,
					FOREIGN KEY (user) REFERENCES users (user) FOREIGN KEY (answerID) REFERENCES answers (answerID)
					PRIMARY KEY (user, answerID))`

			await this.db.run(sql)
			await this.db.run(sql1)
			await this.db.run(sql2)
			await this.db.run(sql3)
			return this
		})()
	}

	/**
	 * Adds a questionID and answerID to the database.
	 * @param {integer} questionID - The ID of the question that was asked.
	 * @param {integer} answerID - The ID of the answer to a question.
	 * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
	 * @throws Will throw an error if either questionID or answerID are ''.
	 */
	async addQuestionAnswer(questionID, answerID) {
		try {
			if (questionID === '') throw new Error('There is no questionID')
			if (answerID === '') throw new Error('There is no answerID')

			const sql = `INSERT INTO QuestionAnswers(questionID, answerID) VALUES(${questionID}, ${answerID});`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	/**
     * Retrieves all the questions with their incorrect answers in the database.
	 * @returns {Promise<Array<userAnswerData>>} Array containing all the incorrect answers with their users for a
     * question in the database.
     */
	async allQuestionAnswers(questionID) {
		try {
			if (questionID === '') throw new Error('There is no questionID')
			const sql = `SELECT u.*, a.*, coalesce(round(AVG(ur.stars), 1), 0) AS avgStars FROM users AS u,
			questions AS q, answers AS a INNER JOIN UserAnswers USING (user, answerID)
			INNER JOIN QuestionAnswers qa USING (questionID, answerID)
			LEFT JOIN CorrectAnswers ca USING (questionID, answerID) LEFT JOIN UserRatings ur USING (answerID)
			WHERE q.questionID = ${questionID} AND ca.answerID IS NULL GROUP BY questionID, answerID`
			let data = await this.db.all(sql)
			data = await ranking.getRankingArr(this.db.filename, data)
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

module.exports = questionAnswer
