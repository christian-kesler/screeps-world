const { strategy } = require('config')
const { creepCensus, generateSpawnDirective } = require('analytics')

module.exports = {
    spawnLoop: () => {

        for (var name in Game.spawns) {

            let census = creepCensus()
            let directive = generateSpawnDirective(strategy, census)

            console.log(`Census: ${JSON.stringify(census)}`)
            console.log(`Directive: ${JSON.stringify(directive)}`)

            for (let i = 0; i < directive.length; i++) {
                if (directive[i].action == "spawn_creep") {
                    Game.spawns[name].spawnCreep(
                        // body
                        [MOVE, MOVE, WORK, CARRY, CARRY],
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