const mysql = require('mysql')

const sql = (db, query, callback) => {
	const connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: db
	})

	connection.connect()
	
	connection.query(query, (err, res) => {
		return callback(err, res)
	})

	connection.end()
}

module.exports = sql