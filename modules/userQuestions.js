'use strict'

const sqlite = require('sqlite-async')
const testDatabase = require('./dummyData.js')
const correctAnswers = require('./correctAnswer.js')
const ranking = require('./ranking.js')

/**
 * @fileoverview A file that's primarily used to retrieve users with their questions to a database. Adding questions
 * with their users is a dependancy for question.js and should not be used by other files or classes unless necessary.
 */

/**
 * A class that represents questions with the users who posted it with methods to read and write questions and users
 * to a database.
 */
class userQuestion {
	/**
     * Creates the link table between users and questions in the database.
     * @param {string} [dbName = :memory:] - The file path to the database. By default it creates a database in memory.
     */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			const sql = `CREATE TABLE IF NOT EXISTS users (user TEXT PRIMARY KEY, pass TEXT,
				avatarPath TEXT, score INTEGER DEFAULT 0);`
			const sql1 = `CREATE TABLE IF NOT EXISTS questions (questionID INTEGER PRIMARY KEY AUTOINCREMENT,
					question TEXT, descript TEXT, screenshotPath TEXT, dateAdded TEXT);`
			const sql2 = `CREATE TABLE IF NOT EXISTS UserQuestions (user TEXT, questionID INTEGER,
				FOREIGN KEY (user) REFERENCES users (user)
				FOREIGN KEY (questionID) REFERENCES questions (questionID)
				PRIMARY KEY (user, questionID)
			);`

			await this.db.run(sql)
			await this.db.run(sql1)
			await this.db.run(sql2)
			return this
		})()
	}

	/**
	 * Adds a username and questionID to the database.
	 * @param {string} user - The username of who posted the question.
	 * @param {integer} questionID - The ID of the question that was asked.
	 * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
	 * @throws Will throw an error if either user or questionID are ''.
	 */
	async addUserQuestion(user, questionID) {
		try {
			if(user === '') throw new Error('There is no user')
			if(questionID === '') throw new Error('There is no questionID')
			const sql = `INSERT INTO UserQuestions(user, questionID) VALUES("${user}", ${questionID});`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	/**
	 * @typedef {Object} userQuestionData
	 * @property {string} user - The username of the user.
	 * @property {string} pass - The user's password.
	 * @property {string} avatarPath - The user's profile picture directory path.
	 * @property {integer} score - The user's score.
	 * @property {integer} questionID - The ID of the question.
	 * @property {string} question - The title of the question.
	 * @property {string} descript - The description of the question.
	 * @property {string} screenshotPath - The path to the screenshot attached to the question.
	 * @property {string} dateAdded - The date and time the question was asked.
	 * @property {boolean} solved - Determines whether the question has a correct answer. If it does not
	 * it will be ''.
	 * @property {boolean} gold - Determines whether the user has a score higher than 5 than the userbase.
	 * @property {boolean} silver - Determines whether the user has a score higher than 25% than the userbase.
	 * @property {boolean} bronze - Determines whether the user has a score higher than 50% than the userbase.
	 */

	/**
     * Retrieves all the questions with their users in the database.
     * @returns {Promise<Array<userQuestionData>>} Array containing all the questions with their users in the database.
     */
	async allUserQuestions() {
		try {
			const sql = 'SELECT * FROM users, questions JOIN UserQuestions USING (user, questionID)'
			let data = await this.db.all(sql)
			if(data.length === 0) throw new Error('There are no user questions')
			for(let question of data) {
				question = await isSolved(this.db.filename, question)
			}
			data = await ranking.getRankingArr(this.db.filename, data)
			return data
		} catch (err) {
			throw err
		}
	}

	/**
	 * Retreives a question from the database if it matches the questionID.
	 * @param {integer} questionID - The ID of the question.
	 * @returns {Promise<userQuestionData>} - Object containing the question details.
	 * @throws Will throw an error is id is ''.
	 */
	async oneUserQuestion(questionID) {
		try {
			if(questionID === '') throw new Error('There is no questionID')
			const sql = `SELECT * FROM users, questions JOIN UserQuestions USING (user, questionID)
				WHERE questionID = ${questionID}`
			let data = await this.db.get(sql)
			data = await ranking.getRankingObj(this.db.filename, data)
			return data
		} catch (err) {
			throw err
		}
	}

	/**
     * Retrieves one question with user details from the database that matches the search queries.
     * @param {integer} id - The ID of the question to be searched.
     * @param {string} query - The title of the question to be searched.
     * @returns {Promise<userQuestionData>} The question that matched the search query.
     */
	async searchUserQuestion(query) {
		try {
			if (query === '') throw new Error('There are no search terms provided')
			const sql = `SELECT * FROM users, questions JOIN UserQuestions USING (user, questionID) 
				WHERE question LIKE "%${query}%"`
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

/**
 * A function that checks if a question object has a correct answer and if it does, it will add a
 * solved property to it.
 * @param {string} [dbName = :memory] - The filename of the database.
 * @param {userQuestionData} question - The question that will be checked if it has a correct answer.
 * @param {boolean} test - Determines whether the funtion is being called by a unit test.
 * @returns {Promise<userQuestionData>} The question with a solved property defined as true or is undefined.
 */

const isSolved = async(dbName, question, test = false) => {
	try {
		await checkParams(question)
		const ca = await new correctAnswers(dbName)
		if (test === true) await ca.__createTestDB()
		const record = await ca.oneCorrectAnswer(question.questionID)
		if (record.length === 0) question.solved = false
		else question.solved = true
		return question
	} catch (err) {
		if (err.message === 'There are no questions') throw err
		question.solved = false
		return question
	}
}

const checkParams = async(question) => {
	try {
		if (question === '') throw new Error('There are no questions')
	} catch (err) {
		throw err
	}
}

module.exports = { userQuestion, isSolved }
