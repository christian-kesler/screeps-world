const creeps = require('./creeps')
const spawns = require('./spawns')

const {
    plotRoadsFromSpawnsToSources,
    plotRoadsFromSourcesToController
} = require('./rooms')

const {
    generateRoomStrategy,
    conductRoomCreepCensus,
    conductRoomStructureCensus
} = require('./analytics')
const { executeAtInterval } = require('./utils')

module.exports.loop = function () {

    console.log('    vvvv    ')

    executeAtInterval(conductRoomCreepCensus, [], 9)
    executeAtInterval(generateRoomStrategy, [], 23)
    executeAtInterval(conductRoomStructureCensus, [], 100)
    executeAtInterval(plotRoadsFromSpawnsToSources, [], 101)
    executeAtInterval(plotRoadsFromSourcesToController, [], 103)

    creeps.creepLoop()
    spawns.spawnLoop()

    console.log('    ^^^^    ')

}