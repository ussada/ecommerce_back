require('dotenv').config();
const fs = require('fs');

const dialectOptions = {
  charset: 'utf8',
  collate: 'utf8_unicode_ci',
  bigNumberStrings: true
}

const define = {
  charset: 'utf8',
  collate: 'utf8_unicode_ci',
  createdAt: 'create_datetime',
  updatedAt: 'modify_datetime'
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions,
    define
  },
  test: {
    username: process.env.CI_DB_USERNAME,
    password: process.env.CI_DB_PASSWORD,
    database: process.env.CI_DB_NAME,
    host: '127.0.0.1',
    port: process.env.CI_DB_PORT,
    dialect: 'mysql',
    dialectOptions,
    define
  },
  production: {
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql',
    dialectOptions,
    define
  },
  tablePrefix: 'tbl_'
};