const { generateSpawnDirective } = require('analytics')

module.exports = {
    spawnLoop: () => {

        for (var name in Game.spawns) {

            let spawn = Game.spawns[name]
            console.log(`CENSUS: ${JSON.stringify(spawn.room.memory.census)}`)
            console.log(`STRATEGY CODE: ${spawn.room.memory.strategyCode}`)

            let directive = generateSpawnDirective(spawn)

            console.log(`Directive: ${JSON.stringify(directive)}`)

            for (let i = 0; i < directive.length; i++) {
                if (directive[i].body == null) {
                    directive[i].body = [MOVE, MOVE, WORK, CARRY, CARRY]
                }
                if (directive[i].action == "spawn_creep") {
                    Game.spawns[name].spawnCreep(
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