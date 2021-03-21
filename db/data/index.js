const ENV = process.env.NODE_ENV || "development";
const test = require("./test-data/index");
const development = require("./development-data/index");

const data = { test, development, production: development };

/*const data = {
  development: devData,
  test: testData,
  production: devData,
};*/

module.exports = data[ENV];
