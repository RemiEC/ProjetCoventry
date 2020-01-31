'use strict'
const sqlite = require('sqlite-async')
/**
 * @fileoverview A file that's primarily used to retrieve users with their id and rating to a database. Adding rating
 * with their users is a dependancy for rate.js and should not be used by other files or classes unless necessary.
 */
/**
 * A class that represents rating with the users who posted them with methods to read and write answerID, stars and
 * users to a database.
 */
class Rate {
	/**
     * Creates the UserRatings table in the database.
     * @param {string} [dbName = :memory:] - The file path to the database. By default it creates a database in memory.
     */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS UserRatings (
                user TEXT,
                answerID INTEGER,
                stars INTEGER,
                FOREIGN KEY (user) REFERENCES users (user)
                FOREIGN KEY (answerID) REFERENCES answers (answerID)
                PRIMARY KEY (user, answerID))`
			await this.db.run(sql)
			return this
		})()
	}
	/**
     * Inserts the answer rating into the UserRatings table.
     * @param {string} user The name of the user which is rating an answer
     * @param {integer} id The unique answer ID
     * @param {integer} stars Number of stars given by the user (to the particular answer by id)
     * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
     */
	async addRate(user, id, stars) {
		try {
			if(stars === undefined) throw new Error('There is no star rating provided')
			const sql = `INSERT INTO UserRatings(user, answerID, stars) VALUES("${user}", "${id}", "${stars}")`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}
}
module.exports = Rate
