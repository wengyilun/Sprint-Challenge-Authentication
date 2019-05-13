const axios = require('axios');
const bcrypt = require('bcryptjs')
const secrets = require('../secrets/secrets')
const db = require('../database/dbConfig')
const dbo = require('../utils/dbo')
const verifyRequestBodyOnRegister = require('../utils/errorHandlers/verifyRequestBodyOnRegister')
const verifyRequestBodyOnLogin = require('../utils/errorHandlers/verifyRequestBodyOnLogin')
const serverErrorHandler = require('../utils/errorHandlers/serverErrorHandler')
const { authenticate, generateToken } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', verifyRequestBodyOnRegister, register);
  server.post('/api/login',verifyRequestBodyOnLogin, login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  // encrypt password
  const user = req.body
  const hash = bcrypt.hashSync(secrets.jwtSecret, 14)
  user.password = hash
  
  //save to db
  dbo.registerUser(user)
    .then( user => {
       res.status(201).json({message:user})
    })
    .catch(e => {
      res.status(e.status || 500).json({ message: 'Could not retrieve data from server' });
    })
}

async function login(req, res) {
  // implement user login
  // check password
  const {username, password} = req.body
  // see if user is found
  try {
    const userFound = await dbo.findBy({username})
    console.log('userFound', userFound)
    console.log('password', password)
    // and password match
    if(userFound && bcrypt.compare(password, userFound.password)){
      // generate a token
      const token = generateToken(userFound)
      // send back user id and the token
      res.status(200).json({userId: userFound.userId, token})
    }else{
      res.status(401).json({
        message: 'You shall not pass!'
      });
    }
  }
  catch(e){
    console.log(e)
    res.status(e.status || 500).json({ message: 'Could not retrieve data from server' });
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
