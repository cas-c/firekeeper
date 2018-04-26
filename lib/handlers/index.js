const { switcher } = require('../utils');
const dmHandler = require('./dm');
const gmHandler = require('./gm');
    

module.exports = (message, key) => switcher({
    'dm': () => dmHandler(message),
    'text': () => gmHandler(message)
})()(key);