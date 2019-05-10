module.exports = callback => async (req, res, next) => {
		try {
		 	await callback(req, res, next)
		}
		catch(error){
			res.status(error.status || 500).json({ message: 'Could not retrieve data from server' });
		}
}
