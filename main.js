const { strategy } = require('./config')


// # convenience functions
const verifyCreep = (creep, callback) => {
    if (creep == undefined) {
        console.log(new Error('function expects a creep arg'))
    } else {
        callback()
    }
}

const richestSourceInRoom = (creep) => {
    sources = creep.room.find(FIND_SOURCES)

    richestSource = sources[0]
    sources.forEach((source, index) => {
        if (source.energy > richestSource.energy) {
            richestSource = source
        }
    })

    return richestSource
}

// # behavior functions

/* gatherEnergy
    desc
        moves creep to resource and gathers energy
    args
        creep - required
        resource - optional
            defaults to nearest active resource if not provided
*/
const gatherEnergy = (creep, resource) => {
    verifyCreep(creep, () => {
        if (creep.memory.resourceID == null) {
            creep.memory.resourceID = (resource != undefined) ? resource.id : richestSourceInRoom(creep).id;
        }
        if (creep.harvest(Game.getObjectById(creep.memory.resourceID)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.resourceID), { visualizePathStyle: { stroke: '#ffffff' } });
        }
    })
}

/* gatherEnergy
    desc
        moves creep to spawn and deposit energy
    args
        creep - required
        spawn - optional
            defaults to nearest spawn if not provided
*/
const depositEnergy = (creep, spawn) => {
    verifyCreep(creep, () => {
        creep.memory.resourceID = null
        spawn = (spawn != undefined) ? spawn : Game.spawns[Object.keys(Game.spawns)[0]];
        if (creep.transfer(spawn, RESOURCE_ENERGY) < 0) {
            creep.moveTo(spawn, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    })
}

const conductCensus = (creeps) => {
    census = {
        "total": 0
    }
    for (var name in Game.creeps) {
        creep = Game.creeps[name]

        if (census[creep.memory.role] == undefined) {
            census[creep.memory.role] = 1
            census['total'] = census['total'] + 1
        } else {
            census[creep.memory.role] = census[creep.memory.role] + 1
            census['total'] = census['total'] + 1
        }
    }

    return census
}

const generateDirective = (strategy, census) => {
    directive = []

    for (role in strategy.role_ratios) {
        if (census[role] == null) census[role] = 0
        current_ratio = census[role] / census['total']
        desired_ratio = strategy.role_ratios[role]

        console.log(role, current_ratio, desired_ratio)
        if (desired_ratio > current_ratio) {
            directive.push({
                "action": "spawn_creep",
                "role": role
            })
        }
    }
    return directive
}

const roleBehavior = (creep) => {
    if (creep.memory.role == 'harvester') {
        if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
            creep.memory.directive = 'gather'
        } else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.directive = 'deposit'
        }

        if (creep.memory.directive == 'gather') {
            gatherEnergy(creep)
        } else if (creep.memory.directive == 'deposit') {
            depositEnergy(creep, Game.spawns[Object.keys(Game.spawns)[0]])
        } else {
            console.log(`${creep} has no directive!`)
        }
    } else if (creep.memory.role == 'builder') {
        if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
            creep.memory.directive = 'gather'
        } else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.directive = 'build'
        }

        if (creep.memory.directive == 'gather') {
            gatherEnergy(creep)
        } else if (creep.memory.directive == 'build') {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            console.log(`${creep} has no directive!`)
        }

    } else if (creep.memory.role == 'upgrader') {
        if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
            creep.memory.directive = 'gather'
        } else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.directive = 'deposit'
        }

        if (creep.memory.directive == 'gather') {
            gatherEnergy(creep)
        } else if (creep.memory.directive == 'deposit') {
            if (creep.room.controller) {
                creep.upgradeController(creep.room.controller);
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            console.log(`${creep} has no directive!`)
        }
    }
}

const spawnCreepWithRole = (role, spawn) => {
    console.log('attempting to spawn creep with role ' + role)
    spawn = (spawn == undefined) ?
        Game.spawns[Object.keys(Game.spawns)[0]] :
        spawn

    spawn.spawnCreep(
        strategy.role_definitions[role],
        `${role}_${Game.spawns[Object.keys(Game.spawns)[0]].name}_${Game.time}`,
        { memory: { role: role } }
    )
}


module.exports.loop = function () {

    console.log('vvvvvvvv')

    census = conductCensus(Game.creeps)
    directive = generateDirective(strategy, census)

    if (directive.length == 0) {
        spawnCreepWithRole(strategy.default_new_role)
    } else {
        directive.forEach((directive, index) => {
            spawnCreepWithRole(directive.role)
        })
    }
    console.log(`Census: ${JSON.stringify(census)}`)
    console.log(`Directive: ${JSON.stringify(directive)}`)

    for (var name in Game.creeps) {
        roleBehavior(Game.creeps[name])
    }

    console.log('^^^^^^^^')

}
