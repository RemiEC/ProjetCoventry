'use strict'

const Users = require('../modules/user.js')

/**
 * A function that assigns a rank to a user whether it be gold, silver or bronze. Maybe the user
 * doesn't qualify for a rank.
 * @param {string} [dbName = :memory:] - The file path to the database.
 * @param {userQuestionData|userAnswerData} objWithScore - The object with the user information
 * that needs a rank assigned to it.
 * @param {boolean} test - Determines whether the funtion is being called by a unit test.
 * @returns {Promise<userQuestionData>|Promise<userAnswerData>} The object with the user's rank added.
 */
const getRankingObj = async(dbName, objWithScore, test = false) => {
	const user = await new Users(dbName)
	if (test === true) await user.__createTestDB()
	const max = await user.getMaxScore()

 	const gold = 0.95 // Gold star if user is top 5%
	const silver = 0.75 // Silver star if user is top 25%
	const bronze = 0.5 // Bronze star if user is top 50%

	if (objWithScore.score >= max * bronze) objWithScore.bronze = true

	if (objWithScore.score >= max * silver) {
		objWithScore.silver = true
		delete objWithScore.bronze
	}

	if (objWithScore.score >= max * gold) {
		objWithScore.gold = true
		delete objWithScore.silver
		delete objWithScore.bronze
	}

	return objWithScore
}

/**
 * A function that assigns a rank to a user in an array whether it be gold, silver or bronze. Maybe the user
 * doesn't qualify for a rank.
 * @param {string} [dbName = :memory] - The file path to the database.
 * @param {Array<QuestionData>|Array<userAnswerData>} records - An array containing objects with user information.
 * @param {boolean} test - Determines whether the funtion is being called by a unit test.
 * @returns {Promise<Array<userQuestionData>>|Promise<Array<userAnswerData>>} The array containg objects with the
 * user's rank added.
 */
const getRankingArr = async(dbName, records, test = false) => {
	for (let record of records) {
		record = await getRankingObj(dbName, record, test)
	}
	return records
}
module.exports = {getRankingObj, getRankingArr}
