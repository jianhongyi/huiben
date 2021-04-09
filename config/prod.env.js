'use strict';
const { baseUrl } = require('./base-url');

module.exports = {
    NODE_ENV: '"production"',
    BASE_URL: JSON.stringify(baseUrl),
};
