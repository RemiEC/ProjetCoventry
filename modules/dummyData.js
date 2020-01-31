'use strict'

const path = require('path')
const fs = require('fs')

/**
 * @fileoverview A file with a function that retreives all the text in a text file and returns it as an array.
 */

/**
 * Retreives all the SQLite commands in database.txt and places them into an array.
 * @returns {Array<string>} An array with all the SQLite commands from the text file.
 */
const insertData = async() => {
	let dirName = __dirname
	dirName = path.normalize(dirName)
	const sqlTxt = fs.readFileSync(`${dirName}/database.txt`, 'utf-8')
	const sqlArray = sqlTxt.split('\n')
	return sqlArray
}

module.exports = insertData
