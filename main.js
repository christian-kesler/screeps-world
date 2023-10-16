const creeps = require('./creeps')
const spawns = require('./spawns')

module.exports.loop = function () {

    creeps.creepLoop()
    spawns.spawnLoop()

}