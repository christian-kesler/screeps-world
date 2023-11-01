const creeps = require('./creeps')
const spawns = require('./spawns')

const { generateRoomStrategy, conductRoomCensus } = require('./analytics')
const { executeAtInterval } = require('./utils')

module.exports.loop = function () {

    console.log('    vvvv    ')

    executeAtInterval(conductRoomCensus, [], 10)
    executeAtInterval(generateRoomStrategy, [], 16)

    creeps.creepLoop()
    spawns.spawnLoop()

    console.log('    ^^^^    ')

}