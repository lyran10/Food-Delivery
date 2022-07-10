// connecting to the data base
const knex = require('knex');
const dotenv = require('dotenv');

// connecting to .env
dotenv.config();

const db = knex({
  client:'pg',
  connection: {
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user: process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    ssl:{rejectUnauthorized:false}
  }
})

module.exports = db