// const nurse = require('./roles/nurse')
// const engineer = require('./roles/engineer')
// const upgrader = require('./roles/upgrader')

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

/* gatherEnergy
desc
    moves creep to resource and gathers energy
args
    creep - required
    resource - optional
        defaults to nearest active resource if not provided
*/
const gatherEnergy = (creep, resource) => {
    if (creep.memory.resourceID == null) {
        creep.memory.resourceID = (resource != undefined) ? resource.id : richestSourceInRoom(creep).id;
    }
    if (creep.harvest(Game.getObjectById(creep.memory.resourceID)) == ERR_NOT_IN_RANGE) {
        creep.moveTo(
            Game.getObjectById(creep.memory.resourceID),
            { visualizePathStyle: { stroke: '#ffffff' } }
        );
    }
}

getNurseDepositTarget = (creep) => {
    var targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN
        }
    });

    let target = targets[0]
    targets.forEach((item) => {
        console.log(item.store.getFreeCapacity(RESOURCE_ENERGY), item.store.getCapacity(RESOURCE_ENERGY))
        if (item.store.getFreeCapacity(RESOURCE_ENERGY) > target.store.getFreeCapacity(RESOURCE_ENERGY)) {
            target = item
        }
    })

    return target
}

const nurse = {
    depositEnergy: (creep) => {
        creep.memory.resourceID = null

        var targets = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN
            }
        });

        let target = targets[0]
        targets.forEach((item) => {
            if (item.store.getFreeCapacity(RESOURCE_ENERGY) > target.store.getFreeCapacity(RESOURCE_ENERGY)) {
                target = item
            }
        })

        if (creep.transfer(target, RESOURCE_ENERGY) == -9) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        }

    }
}


const creepManager = {
    useResources: {},
    gatherResources: {},
}

module.exports = {

    setBehaviorByRole: (creep) => {
        directives = [
            'gatherResources',
            'useResources'
        ]
        // setting directive
        if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
            creep.memory.directive = 'gatherResources'
        } else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.directive = 'useResources'
        } else if (!creep.memory.directive in directives) {
            creep.memory.directive = 'gatherResources'
        }

        // reading directive
        // creepManager[creep.memory.directive][creep.memory.role](creep)

        if (creep.memory.directive == 'gatherResources') {
            gatherEnergy(creep)
        } else if (creep.memory.directive == 'useResources') {
            // selecting behavior based on role
            if (creep.memory.role == 'nurse' || creep.memory.role == 'harvester') {
                nurse.depositEnergy(creep)

            } else if (creep.memory.role == 'engineer' || creep.memory.role == 'builder') {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#00FF00' } });
                    }
                }

            } else if (creep.memory.role == 'upgrader') {
                if (creep.room.controller) {
                    creep.upgradeController(creep.room.controller);
                    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
                }

            } else {
                console.log(`${creep} has unrecognized role of ${role}!`)

            }

        } else {
            creep.memory.directive = 'gatherResources'
        }
    }
}