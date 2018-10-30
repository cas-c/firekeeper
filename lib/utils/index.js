// this is a simple functional switch statement you see pretty often in my repos
// improvements to be made: you can make this a more general switch and create a version that calls the function
const switcher = cases => defaultCase => key => cases.hasOwnProperty(key) ? cases[key]() : defaultCase;

module.exports = {
    switcher
}
