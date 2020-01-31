'use strict'
const QuestionAnswers = require('./questionAnswers')
const CorrectAnswer = require('./correctAnswer')
module.exports = async(id, dbName, test) => {
	const qa = await new QuestionAnswers(dbName)
	const ca = await new CorrectAnswer(dbName)
	if(test === true) {
		await qa.__createTestDB()
		await ca.__createTestDB()
	}
	const correctAnswer = await ca.oneCorrectAnswer(id)
	if (correctAnswer.length !== 0) correctAnswer[0].correct = true
	const otherAnswers = await qa.allQuestionAnswers(id)
	const answerData = correctAnswer.concat(otherAnswers)
	return answerData

}

