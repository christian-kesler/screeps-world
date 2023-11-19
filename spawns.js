const { generateSpawnDirective } = require('analytics')

module.exports = {
    spawnLoop: () => {

        for (var name in Game.spawns) {
            let spawn = Game.spawns[name]
            let roomMemory = spawn.room.memory

            // console.log(`CREEP CENSUS: ${JSON.stringify(roomMemory.creepCensus)}`)
            // console.log(`STRUCTURE CENSUS: ${JSON.stringify(roomMemory.structureCensus)}`)
            // console.log(`STRATEGY CODE: ${roomMemory.strategyCode}`)

            let directive = generateSpawnDirective(spawn)

            // console.log(`DIRECTIVE: ${JSON.stringify(directive)}`)

            if (directive && directive.length > 0) {
                for (let i = 0; i < directive.length; i++) {
                    if (directive[i].body == null) {
                        directive[i].body = [MOVE, MOVE, WORK, CARRY, CARRY]
                    }
                    if (directive[i].action == "spawn_creep") {
                        spawn.spawnCreep(
                            // body
                            directive[i].body,
                            // name
                            `${directive[i].role}_${name}_${Game.time}`,
                            // options
                            { memory: { role: directive[i].role } }
                        )
                    }
                }
            }
        }
    }
}