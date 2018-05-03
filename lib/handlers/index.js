const config = require('../../config');

const { switcher } = require('../utils');
const dmHandler = require('./dm');
const gmHandler = require('./gm');
const devHandler = require('./dev');
    

module.exports = (message, key) => switcher({
    'dm': () => dmHandler(message),
    'text': () => gmHandler(message)
})()(key);