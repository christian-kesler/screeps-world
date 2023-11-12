const creeps = require('./creeps')
const spawns = require('./spawns')

const { plotRoadsBetweenStructures } = require('./rooms')

const {
    generateRoomStrategy,
    conductRoomCreepCensus,
    conductRoomStructureCensus
} = require('./analytics')
const { executeAtInterval } = require('./utils')

module.exports.loop = function () {

    console.log('    vvvv    ')

    executeAtInterval(conductRoomCreepCensus, [], 10)
    executeAtInterval(generateRoomStrategy, [], 16)
    executeAtInterval(conductRoomStructureCensus, [], 99)
    executeAtInterval(plotRoadsBetweenStructures, [], 98)

    creeps.creepLoop()
    spawns.spawnLoop()

    console.log('    ^^^^    ')

}