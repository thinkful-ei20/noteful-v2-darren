'use strict';

const knex = require('../knex');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = function(file, user = 'dev') {
  console.log('User is:::::::',user);
  return exec(`psql -U ${user} -f ${file} -d ${knex.client.connectionSettings.database}`);
};

