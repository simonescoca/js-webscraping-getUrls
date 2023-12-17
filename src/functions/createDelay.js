function createDelay(minimumSeconds, randomSeconds) {
    return Math.round((Math.random() * randomSeconds * 1000) + (minimumSeconds * 1000));
}

module.exports = createDelay;