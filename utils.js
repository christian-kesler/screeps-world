module.exports = {
    executeAtInterval: (myFunction, myArgs, tickInterval) => {
        if (Game.time % tickInterval == 0) {
            myFunction(...myArgs)
        }
    }
}