const strategies = require('./strategies')
const { conductCensus, generateDirective } = require('./analytics')
const { spawnCreepWithRole } = require('./spawns')
const { setBehaviorByRole } = require('./creeps')

module.exports.loop = function () {

    console.log('vvvvvvvv')

    census = conductCensus(Game.creeps)
    directive = generateDirective(strategies.rcl3, census)

    if (directive.length == 0) {
        spawnCreepWithRole(strategies.rcl1.default_new_role)
    } else {
        directive.forEach((directive, index) => {
            spawnCreepWithRole(directive.role)
        })
    }
    console.log(`Census: ${JSON.stringify(census)}`)
    console.log(`Directive: ${JSON.stringify(directive)}`)

    for (var name in Game.creeps) {
        setBehaviorByRole(Game.creeps[name])
    }

    console.log('^^^^^^^^')

}
