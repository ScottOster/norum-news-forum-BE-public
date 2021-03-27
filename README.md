**SUMMARY OF PROJECT**:

This API was built during my training at Northcoders, in order to mimic the functionality of a real world back-end service such as Reddit. It was built using Express, Node Postegres (with knex wrapper for SQL queries.) and tested using jest, supertest and jest sorted.

The hosted version can be found at : https://norum-news-forum.herokuapp.com/api

**Getting Started:**

**Cloning the repository:**

    • Navigate to the repo page and click on the green code button.
    • Copy the https URL
    • Navigate to the desired location folder in your terminal
    • Enter the command $git clone followed by the URL ($git clone URLHERE)

**Installing Dependencies:**

**The following dependencies will be required:**

Node Postgres – Installed with the command $npm install pg
Express - Installed with the command $npm install express
Knex- Installed with the command $npm install knex

The following developer dependencies will be required:

Jest- Installed with the command $npm install -d jest
Supertest- Installed with the command $npm install -d supertest
Jest-Sorted -Installed with the command $npm install -d jest-sorted

**How to seed local database:**

Use command...

$npm run seed-dbs

The following script in the package.json will then create both test and development databases, and run the seed file.

"seed-dbs": "npm run setup-dbs && knex seed:run"

**Running tests:**

Use the following commands to run tests:

all tests (including api and util functions): $npm test

app tests only: $ npm run test app

**Knexfile.js**

You will need to create a file stored in the root directory called knexfile.js.

This is to provide knex with the required config information (including client adapter and specified database) and the location of the seed function.

_NOTE: Mac users will not require a username and password for local connections, but Linux and Windows users will need to add these properties to connections in the knex file._

The file should be set up as follows:

const ENV = process.env.NODE_ENV || "development";
const baseConfig = {
client: "pg",
migrations: { directory: "./db/migrations" },
seeds: { directory: "./db/seeds" },
};
const customConfig = {
production: {
connection: {
connectionString: DB_URL,
ssl: {
rejectUnauthorized: false,
},

Linux/Windows USERS should add user and password for local machine , MAC users may need to delete the keys...
user:
password:
},
},

development: {
connection: {
database: "nc_news",
user:
password:
},
},
test: {
connection: {
database: "nc_news_test",
user:
password:
},
},
};
module.exports = { ...customConfig[ENV], ...baseConfig };

Each key in the config object represents a different database that can be connected to. NOTE: ensure that the seeds object is nested inside both the development and testing object.

**Ensure the Knexfile is git ignored in order to protect any passwords that are provided!!**

**Minimum Versions:\*\***

The project was built using the following versions, so these can be safely considered the minimum:

NODE: v14.15.5

Dependencies:

"dependencies": {
"express": "^4.17.1",
"pg": "^8.5.1",
"knex": "^0.95.2"
},
"devDependencies": {
"jest": "^26.6.3",
"supertest": "^6.1.3",
"jest-sorted": "^1.0.11",
"sorted": "^0.1.1"
