const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const configureRoutes = require('../config/routes.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.get('/', (req, res)=> {
	res.status(200).send('welcome to the site')
})

configureRoutes(server);

module.exports = server;
