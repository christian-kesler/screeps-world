const strategies = require('./strategies')

module.exports = {
    spawnCreepWithRole: (role, spawn) => {
        // defining spawn if not present
        spawn = (spawn == undefined) ?
            Game.spawns[Object.keys(Game.spawns)[0]] :
            spawn

        if (strategies[`rcl${spawn.room.controller.level}`] != undefined) {
            spawn.spawnCreep(
                strategies[`rcl${spawn.room.controller.level}`].role_definitions[role],
                `${role}${spawn.room.controller.level}_${Game.spawns[Object.keys(Game.spawns)[0]].name}_${Game.time}`,
                { memory: { role: role } }
            )
        } else {
            spawn.spawnCreep(
                strategies[`default`].role_definitions[role],
                `${role}d_${Game.spawns[Object.keys(Game.spawns)[0]].name}_${Game.time}`,
                { memory: { role: role } }
            )
        }
    }
}