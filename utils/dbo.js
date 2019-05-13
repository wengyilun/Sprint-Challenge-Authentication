const db = require('../database/dbConfig')

function getAllUsers() {
	return db('users').select('id', 'username');
}

async function findBy(filter) {
	// console.log('filter', filter)
	console.log(filter)
	const user =  db('users').where(filter)
	console.log(user)
	return user
}

async function registerUser(user) {
	const [id] = await db('users').insert(user);
	
	return findById(id);
}

function findById(id) {
	return db('users')
	.select('id', 'username')
	.where({ id })
	.first();
}


module.exports = {
	getAllUsers,
	registerUser,
	findBy,
	findById
}
