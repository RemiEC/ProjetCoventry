'use strict'
const CorrectAnswers = require('./correctAnswer')

/**
 * @module
 */

/**
 * Insert a submitted answer into the database.
 * @param {string} database The database file path
 * @param {integer} id The unique ID that the answer is for
 * @param {string} qid The unique question ID that is for the answer
 */
module.exports = async(database, id, qid) => {
	const ca = await new CorrectAnswers(database)
	const correctAns = await ca.oneCorrectAnswer(qid)
	if (Object.keys(correctAns).length === 0) {
		await ca.addCorrectAnswer(qid, id)
	} else return false
}
