'use strict';

// LOCAL TESTING VERSION: 

// module.exports = {
//   development: {
//     client: 'pg',
//     connection: process.env.DATABASE_URL || 'postgres://dev:dev@localhost/noteful-app',
//     debug: true, // http://knexjs.org/#Installation-debug
//     pool: { min: 1, max: 2 }
//   },
//   production: {
//     client: 'pg',
//     connection: process.env.DATABASE_URL
//   },
//   test: {
//     client: 'pg',
//     connection: process.env.TEST_DATABASE_URL || 'postgres://dev:dev@localhost/noteful-test',
//     pool: { min: 1, max: 2 }
//   },
// };





// IF YOU WANT TO PUSH TO TRAVIS USE THIS ONE....

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/noteful-app',
    debug: true, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgres://localhost/noteful-test',
    pool: { min: 1, max: 2 }
  },
};