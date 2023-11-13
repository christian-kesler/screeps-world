const creeps = require('./creeps')
const spawns = require('./spawns')

const {
    plotRoadsFromSpawnsToSources,
    plotRoadsFromSourcesToController,
    plotExtentionsFromSpawns
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
    executeAtInterval(plotExtentionsFromSpawns, [], 107)

    creeps.creepLoop()
    spawns.spawnLoop()

    console.log('    ^^^^    ')

}