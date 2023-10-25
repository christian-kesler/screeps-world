const moveToOpt = {
    visualizePathStyle: {
        fill: 'transparent',
        stroke: '#fff',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .5
    }
}

const creepBehaviorObject = {
    nurse: (creep) => {

        if (creep.memory.useTargetId == null) {

            // find extensions in room
            extensions = creep.room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_EXTENSION }
            })

            // curated array of extensions
            let nonFullExtensions = []

            // look for empty extensions and push to curated array
            for (var name in extensions) {
                if (extensions[name].store.getFreeCapacity(RESOURCE_ENERGY) != 0) {
                    nonFullExtensions.push(extensions[name])
                }
            }

            // if there are enough extensions to compare
            if (nonFullExtensions.length > 1) {

                // find closest
                creep.memory.useTargetId = creep.pos.findClosestByPath(nonFullExtensions).id

                // if only one valid extension
            } else if (nonFullExtensions.length == 1) {

                // target without path calculation
                creep.memory.useTargetId = nonFullExtensions[0].id

                // if no empty extensions found
            } else {

                // set target to primary spawn
                creep.memory.useTargetId = Game.spawns[Object.keys(Game.spawns)[0]].id
            }

        } else {
            // if target has no free capacity
            if (Game.getObjectById(creep.memory.useTargetId).store.getFreeCapacity(RESOURCE_ENERGY) == 0) {

                // clear target and recalculate
                creep.memory.useTargetId = null
            }

            // attempt transfer action
            if (creep.transfer(Game.getObjectById(creep.memory.useTargetId), RESOURCE_ENERGY) == -9) {

                // moveto target if actions failed due to distance
                creep.moveTo(Game.getObjectById(creep.memory.useTargetId), moveToOpt)
            }
        }
    },
    engineer: (creep) => {
        if (creep.memory.useTargetId == null) {

            // find roads in room
            roads = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_ROAD }
            })

            // look for broken roads and set target if found
            for (var name in roads) {
                if (roads[name].hits <= 2000) {
                    creep.memory.useTargetId = roads[name].id
                }
            }

            // if no broken roads found
            if (creep.memory.useTargetId == null) {

                // set target to construction site
                creep.memory.useTargetId = Game.constructionSites[Object.keys(Game.constructionSites)[0]].id
            }

        } else {

            // if target has max hits
            if (Game.getObjectById(creep.memory.useTargetId).hits == 5000) {

                // clear target and recalculate
                creep.memory.useTargetId = null
            }

            // attempt build and repair actions
            if (
                creep.build(Game.getObjectById(creep.memory.useTargetId)) == -9
                ||
                creep.repair(Game.getObjectById(creep.memory.useTargetId)) == -9
            ) {

                // moveto target if actions failed due to distance
                creep.moveTo(Game.getObjectById(creep.memory.useTargetId), moveToOpt)
            }
        }
    },
    upgrader: (creep) => {
        // deliver energy to controller
        if (creep.upgradeController(creep.room.controller) == -9) {
            creep.moveTo(creep.room.controller, moveToOpt)
        }
    },
}

module.exports = {
    creepLoop: () => {

        for (var name in Game.creeps) {


            // creep shorthand
            let creep = Game.creeps[name]

            // assessing store capacity and setting directive
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.directive = 'harvestResources'
                creep.memory.useTargetId = null

                // assigning harvest target if not set 
                if (creep.memory.harvestTargetId == null) {
                    let sources = creep.room.find(FIND_SOURCES_ACTIVE)
                    richestEnergySource = sources[0]
                    for (let i = 0; i < sources.length; i++) {
                        if (sources[i].energy > richestEnergySource.energy) {
                            richestEnergySource = sources[i]
                        }
                    }
                    creep.memory.harvestTargetId = richestEnergySource.id
                }
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.directive = 'useResources'
                creep.memory.harvestTargetId = null
            }

            // performing harvest directive
            if (creep.memory.directive == 'harvestResources') {
                if (creep.harvest(Game.getObjectById(creep.memory.harvestTargetId)) == -9) {
                    creep.moveTo(Game.getObjectById(creep.memory.harvestTargetId), moveToOpt)
                }
            }

            // catching unexpected directives
            if (creep.memory.directive != 'harvestResources' && creep.memory.directive != 'useResources') {
                creep.memory.directive = 'useResources'
            }

            // performing use directive
            try {
                if (creep.memory.directive == 'useResources') {
                    creepBehaviorObject[creep.memory.role](creep)
                }
            } catch (err) {
                console.log(err.message)
            }
        }
    }
}
