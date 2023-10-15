/* richestResource
desc
    returns resource in room with the most energy
args
    creep - required
*/
const richestResource = (creep) => {
    sources = creep.room.find(FIND_SOURCES)

    richestSource = sources[0]
    sources.forEach((source, index) => {
        if (source.energy > richestSource.energy) {
            richestSource = source
        }
    })

    return richestSource
}

/* gatherResources
desc
    moves creep to resource and gathers energy
args
    creep - required
    resource - optional
        defaults to nearest active resource if not provided
*/
const gatherResources = (creep, resource) => {
    if (creep.memory.resourceID == null) {
        creep.memory.resourceID = (resource != undefined) ? resource.id : richestResource(creep).id;
    }
    if (creep.harvest(Game.getObjectById(creep.memory.resourceID)) == ERR_NOT_IN_RANGE) {
        creep.moveTo(
            Game.getObjectById(creep.memory.resourceID),
            { visualizePathStyle: { stroke: '#ffffff' } }
        );
    }
}

// directives and nested role logic
const creepManager = {
    gatherResources: {
        nurse: (creep) => {
            gatherResources(creep)
        },
        engineer: (creep) => {
            gatherResources(creep)
        },
        upgrader: (creep) => {
            gatherResources(creep)
        },
    },
    useResources: {
        nurse: (creep) => {
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

        },
        engineer: (creep) => {
            creep.memory.resourceID = null

            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#00FF00' } });
                }
            }

        },
        upgrader: (creep) => {
            creep.memory.resourceID = null

            if (creep.room.controller) {
                creep.upgradeController(creep.room.controller);
                creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }

        },

    },
}

// defining directives
directives = [
    'gatherResources',
    'useResources'
]

module.exports = {

    setBehaviorByRole: (creep) => {

        // setting directive
        if (creep.store.getFreeCapacity() == creep.store.getCapacity()) {
            creep.memory.directive = 'gatherResources'
        } else if (creep.store.getFreeCapacity() == 0) {
            creep.memory.directive = 'useResources'
        } else if (!creep.memory.directive in directives) {
            creep.memory.directive = 'gatherResources'
        }

        // reading directive
        try {
            creepManager[creep.memory.directive][creep.memory.role](creep)
        } catch (err) {
            console.log(`creepManager[${creep.memory.directive}][${creep.memory.role}](${creep}) failed`)
            console.log(err)
        }

    }
}