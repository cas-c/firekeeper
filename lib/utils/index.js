const switcher = cases => defaultCase => key => cases.hasOwnProperty(key) ? cases[key]() : defaultCase;

module.exports = {
    switcher
}