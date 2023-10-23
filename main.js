const creeps = require('./creeps')
const spawns = require('./spawns')

module.exports.loop = function () {

    console.log('    vvvv    ')

    creeps.creepLoop()
    spawns.spawnLoop()

    console.log('    ^^^^    ')

}