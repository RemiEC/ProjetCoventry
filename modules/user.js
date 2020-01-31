'use strict'

const bcrypt = require('bcrypt-promise')
const sqlite = require('sqlite-async')
const submitImage = require('./submitImage')
const shortid = require('shortid')
const testDatabase = require('./dummyData.js')
const fs = require('fs-extra')
const saltRounds = 10

/**
 * @fileoverview A file that's primarily used to add users to a database.
 * The file is also used for everything else related to the user, such as logging in.
 */

/**
 * A class that represents a user with methods to read and write users to a database, as well
 * as adding or subtracting score from a user.
 */
module.exports = class User {
	/**
     * Creates the users table in the database.
     * @param {string} [dbName = :memory:] - The file path to the database. By default it creates a database in memory.
     */
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = `CREATE TABLE IF NOT EXISTS users (user TEXT PRIMARY KEY, pass TEXT, avatarPath TEXT,
				score INTEGER DEFAULT 0);`
			await this.db.run(sql)
			return this
		})()
	}

	/**
	 * Registers a new user to the database.
	 * @param  {string} user - The users chosen username.
	 * @param  {any} pass - The users chosen password.
	 * @param  {any} type - The format of the file
	 * @param  {any} originalpath - The original path of the file
	 * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
	 * @throws Will throw an error if either user, pass or the uploaded image are ''.
	 */
	async register(user, pass, type, originalpath) {
		await this.testforthrow(user, pass, type)
		await this.upload(user, pass, type,originalpath)
		return true
	}

	/**
     * Error checks for any missing fields when registering a new user to the database.
     * @param  {string} user - The users chosen username.
     * @param  {any} pass - The users chosen password.
	 * @param  {any} type - The type of the image
     * @returns {boolean} Whether the method encoutered any errors or not.
     */
	async testforthrow(user, pass, type) {
		await this.testuserandpass(user,pass)
		const checkAttachment = submitImage.validate(type)
		if (checkAttachment.message === 'We do not support uploading images in this format') {
			throw new Error('We do not accept this format')
		}
		if (checkAttachment === 'none') throw new Error('missing avatar')
		return true
	}

	/**
     * Error checks for missing fields in user or pass when registering a new user to the database.
     * @param  {string} user - The users chosen username.
     * @param  {any} pass - The users chosen password.
     * @returns {boolean} Whether the method encoutered any errors or not.
     */
	async testuserandpass(user, pass ) {
		if (user.length === 0) throw new Error('missing username')
		if (pass.length === 0) throw new Error('missing password')
		return true
	}

	/**
     * Uploads an image into a local repository and saves the link to said image into the database.
     * @param  {string} user - The users chosen username.
     * @param  {any} pass - The users chosen password.
     * @param  {any} originalpath - The original path of the file
     * @param  {any} type - The format of the file
     * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
     * @throws Will throw an error if the user is already registered
     */
	async upload(user, pass, type, originalpath) {
		const path = `/avatars/${shortid.generate()}.${
			type
		}`
		const realpath = `public${path}`
		await fs.copy(originalpath, realpath)
		let sql = `SELECT COUNT(user) as records FROM users WHERE user="${user}";`
		const data = await this.db.get(sql)
		if (data.records !== 0) {
			throw new Error(`username "${user}" already in use`)
		}
		pass = await bcrypt.hash(pass, saltRounds)
		sql = `INSERT INTO users(user, pass, avatarPath, score) VALUES("${user}", "${pass}", "${path}", 0)`
		await this.db.run(sql)
		return true
	}

	/**
     * Checks with the database for a username-password match and then logs said user in.
     * @param  {string} username - The user entered username.
     * @param  {any} password - The user entered password.
     * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
     * @throws Will throw an error if the username and password do not match anything in the database.
     */
	async login(username, password) {
		try {
			let sql = `SELECT count(user) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)

			if (!records.count) throw new Error(`invalid username "${username}"`)
			sql = `SELECT pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if (valid === false) {
				throw new Error(`invalid password for account "${username}"`)
			}
			return true
		} catch (err) {
			throw err
		}
	}

	/**
     * Retrieves the profile picture for a given user.
     * @param  {string} username - The username of the user of which you would like to retrieve the profile picture of.
     * @returns {any} The profile picture for a user.
     * @throws Will throw an error if the username is not in the database, or if there is a problem with the image.
     */
	async getPP(username) {
		const sql = `SELECT avatarPath FROM users WHERE user = "${username}";`
		const record = await this.db.get(sql)
		return record
	}

	/**
     * Adds score to a user when on of their answers is marked as correct.
     * @param  {string} user - The name of the user of which you are adding score to.
     * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
     * @throws Will throw an error if the username given isn't in the database.
     */
	async addscore(user) {
		try {
			if(user === '') throw new Error('User does not exist')
			const sql = `UPDATE users SET score = score + 50 WHERE user = "${user}";`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}
	/**
     * Subtracts score to a user when on of their answers is marked as off-topic.
     * @param  {string} user - The name of the user of which you are subtracting score from.
     * @returns {Promise<boolean>} Whether the SQL query ran successfully or not.
     * @throws Will throw an error if the username given isn't in the database.
     */
	async subscore(user) {
		try {
			if(user === '') throw new Error('User does not exist')
			const sql = `UPDATE users SET score = score - 5 WHERE user = "${user}";`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}

	/**
	 * Returns the maximum score of all users in the database.
	 */
	async getMaxScore() {
		const sql = 'SELECT MAX(users.score) AS max FROM users'
		const maximum = await this.db.get(sql)
		return maximum.max
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
