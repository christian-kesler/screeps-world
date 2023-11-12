const moveToOpt = {
    engineer: {
        visualizePathStyle: {
            fill: 'transparent',
            stroke: '#6699cc',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .5
        }
    },
    harvester: {
        visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ed9121',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .5
        }
    },
    nurse: {
        visualizePathStyle: {
            fill: 'transparent',
            stroke: '#e6e6fa',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .5
        }
    },
    upgrader: {
        visualizePathStyle: {
            fill: 'transparent',
            stroke: '#8fbc8f',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .5
        }
    },
}


const findMostWorn = (structures) => {
    let mostWornStructure = {
        hits: Infinity
    }

    // find mostWornStructure in structures
    for (var name in structures) {
        if (structures[name].hits < mostWornStructure.hits) {
            mostWornStructure = structures[name]
        }
    }

    return mostWornStructure
}

const findMostWornRoad = (room) => {
    const roads = room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_ROAD }
    })

    const mostWornRoad = findMostWorn(roads)

    return mostWornRoad
}

const findMostWornContainer = (room) => {
    const containers = room.find(FIND_STRUCTURES, {
        filter: { structureType: STRUCTURE_CONTAINER }
    })

    const mostWornContainer = findMostWorn(containers)

    return mostWornContainer
}


const gatherEnergyFromRichestSource = (creep) => {
    // assigning harvest target if not set 
    if (creep.memory.harvestTargetId == null) {
        let sources = creep.room.find(FIND_SOURCES_ACTIVE)
        richestEnergySource = sources[1]
        for (let i = 0; i < sources.length; i++) {
            if (sources[i].energy > richestEnergySource.energy) {
                richestEnergySource = sources[i]
            }
        }
        creep.memory.harvestTargetTime = Game.time
        creep.memory.harvestTargetId = richestEnergySource.id
    }

    // trying to perform harvest operations
    if (creep.harvest(Game.getObjectById(creep.memory.harvestTargetId)) == -9) {
        creep.moveTo(Game.getObjectById(creep.memory.harvestTargetId), moveToOpt[creep.memory.role])
    } else if (creep.harvest(Game.getObjectById(creep.memory.harvestTargetId)) == -7) {
        creep.memory.harvestTargetId = null
    }
}

const gatherEnergyFromClosestSource = (creep) => {
    // assigning harvest target if not set 
    if (creep.memory.harvestTargetId == null) {
        let sources = creep.room.find(FIND_SOURCES_ACTIVE)

        creep.memory.harvestTargetTime = Game.time
        creep.memory.harvestTargetId = creep.pos.findClosestByPath(sources).id
    }

    // trying to perform harvest operations
    if (creep.harvest(Game.getObjectById(creep.memory.harvestTargetId)) == -9) {
        creep.moveTo(Game.getObjectById(creep.memory.harvestTargetId), moveToOpt[creep.memory.role])
    } else if (creep.harvest(Game.getObjectById(creep.memory.harvestTargetId)) == -7) {
        creep.memory.harvestTargetId = null
    }
}


const gatherResourcesFromContainers = (creep) => {

    // assigning harvest target if not set 
    if (creep.memory.harvestTargetId == null) {
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        })

        richestContainer = containers[0]
        for (let i = 0; i < containers.length; i++) {
            if (containers[i].store.energy > richestContainer.store.energy) {
                richestContainer = containers[i]
            }
        }
        creep.memory.harvestTargetTime = Game.time
        creep.memory.harvestTargetId = richestContainer.id
    }

    // trying to perform harvest operations
    if (creep.withdraw(Game.getObjectById(creep.memory.harvestTargetId), RESOURCE_ENERGY) == -9) {
        creep.moveTo(Game.getObjectById(creep.memory.harvestTargetId), moveToOpt[creep.memory.role])
    } else if (creep.withdraw(Game.getObjectById(creep.memory.harvestTargetId), RESOURCE_ENERGY) == -7) {
        creep.memory.harvestTargetId = null
    }
}


const gatherResourcesByRole = {
    harvester: (creep) => {
        gatherEnergyFromClosestSource(creep)
    },
    nurse: (creep) => {
        if (creep.room.memory.strategyCode >= 1.2) {
            gatherResourcesFromContainers(creep)
        } else {
            gatherEnergyFromRichestSource(creep)
        }
    },
    engineer: (creep) => {
        if (creep.room.memory.strategyCode >= 1.2) {
            gatherResourcesFromContainers(creep)
        } else {
            gatherEnergyFromRichestSource(creep)
        }
    },
    upgrader: (creep) => {
        if (creep.room.memory.strategyCode >= 1.2) {
            gatherResourcesFromContainers(creep)
        } else {
            gatherEnergyFromRichestSource(creep)
        }
    },
}

const useResourcesByRole = {
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
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = creep.pos.findClosestByPath(nonFullExtensions).id

                // if only one valid extension
            } else if (nonFullExtensions.length == 1) {

                // target without path calculation
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = nonFullExtensions[0].id

                // if no empty extensions found
            } else {

                // set target to primary spawn
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = Game.spawns[Object.keys(Game.spawns)[0]].id
            }

        } else {
            // if target has no free capacity
            if (Game.getObjectById(creep.memory.useTargetId).store.getFreeCapacity(RESOURCE_ENERGY) == 0) {

                // clear target and recalculate
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = null
            }

            // attempt transfer action
            if (creep.transfer(Game.getObjectById(creep.memory.useTargetId), RESOURCE_ENERGY) == -9) {

                // moveto target if actions failed due to distance
                creep.moveTo(Game.getObjectById(creep.memory.useTargetId), moveToOpt[creep.memory.role])
            }
        }
    },
    engineer: (creep) => {
        if (creep.memory.useTargetId == null) {

            const mostWornRoad = findMostWornRoad(creep.room)
            const mostWornContainer = findMostWornContainer(creep.room)

            // if mostWornContainer is worn enough
            if (mostWornContainer.hits != Infinity && mostWornContainer.hits <= 100000) {
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetType = 'container'
                creep.memory.useTargetId = mostWornContainer.id

                // if mostWornRoad is worn enough
            } else if (mostWornRoad.hits != Infinity && mostWornRoad.hits <= 2000) {
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetType = 'road'
                creep.memory.useTargetId = mostWornRoad.id

                // if mostWornRoad is not worn enough
            } else {

                if (Object.values(Game.constructionSites).length != 0) {
                    // set target to closest construction site
                    creep.memory.useTargetTime = Game.time
                    creep.memory.useTargetType = 'constructionSite'
                    creep.memory.useTargetId = creep.pos.findClosestByPath(Object.values(Game.constructionSites)).id
                } else {
                    creep.memory.useTargetTime = Game.time
                    creep.memory.useTargetType = 'moveTo'
                    creep.memory.useTargetId = Game.spawns[Object.keys(Game.spawns)[0]].id
                }

            }
        } else {
            if (creep.memory.useTargetType == 'constructionSite') {
                if (creep.build(Game.getObjectById(creep.memory.useTargetId)) == -9) {

                    // moveto target if actions failed due to distance
                    creep.moveTo(Game.getObjectById(creep.memory.useTargetId), moveToOpt[creep.memory.role])
                }
            } else {

                if (creep.repair(Game.getObjectById(creep.memory.useTargetId)) == -9) {

                    // moveto target if actions failed due to distance
                    creep.moveTo(Game.getObjectById(creep.memory.useTargetId), moveToOpt[creep.memory.role])
                }

                if (
                    (
                        creep.memory.useTargetType == 'road'
                        &&
                        Game.getObjectById(creep.memory.useTargetId).hits == 5000
                    )
                    ||
                    (
                        creep.memory.useTargetType == 'container'
                        &&
                        Game.getObjectById(creep.memory.useTargetId).hits > 200000
                    )
                    ||
                    (
                        Game.time - creep.memory.useTargetTime > 100
                    )
                ) {

                    // clear target and recalculate
                    creep.memory.useTargetTime = Game.time
                    creep.memory.useTargetId = null
                }
            }
        }
    },
    upgrader: (creep) => {
        // deliver energy to controller
        if (creep.upgradeController(creep.room.controller) == -9) {
            creep.moveTo(creep.room.controller, moveToOpt[creep.memory.role])
        }
    },
    harvester: (creep) => {

        if (creep.memory.useTargetId == null) {

            // find containers in room
            containers = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            })

            // curated array of containers
            let nonFullContainers = []

            // look for empty containers and push to curated array
            for (var name in containers) {
                if (containers[name].store.getFreeCapacity(RESOURCE_ENERGY) != 0) {
                    nonFullContainers.push(containers[name])
                }
            }

            // if there are enough containers to compare
            if (nonFullContainers.length > 1) {

                // find closest
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = creep.pos.findClosestByPath(nonFullContainers).id

                // if only one valid container
            } else if (nonFullContainers.length == 1) {

                // target without path calculation
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = nonFullContainers[0].id

                // if no empty containers found
            } else {

                // set target to primary spawn
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = Game.spawns[Object.keys(Game.spawns)[0]].id
            }

        } else {
            // if target has no free capacity
            if (Game.getObjectById(creep.memory.useTargetId).store.getFreeCapacity(RESOURCE_ENERGY) == 0) {

                // clear target and recalculate
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = null
            }

            // attempt transfer action
            if (creep.transfer(Game.getObjectById(creep.memory.useTargetId), RESOURCE_ENERGY) == -9) {

                // moveto target if actions failed due to distance
                creep.moveTo(Game.getObjectById(creep.memory.useTargetId), moveToOpt[creep.memory.role])
            }
        }

    }
}


module.exports = {
    creepLoop: () => {

        for (var name in Game.creeps) {

            // creep shorthand
            let creep = Game.creeps[name]

            // assessing store capacity and setting directive
            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.directive = 'harvestResources'
                creep.memory.useTargetTime = Game.time
                creep.memory.useTargetId = null

            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.directive = 'useResources'
                creep.memory.harvestTargetTime = Game.time
                creep.memory.harvestTargetId = null
            }

            try {
                // performing harvest directive
                if (creep.memory.directive == 'harvestResources') {
                    gatherResourcesByRole[creep.memory.role](creep)
                }

                // performing use directive
                if (creep.memory.directive == 'useResources') {
                    useResourcesByRole[creep.memory.role](creep)
                }

            } catch (err) {
                console.log(`ERROR: ${err}`)
                console.log(`TRIGGERED BY CREEP with NAME: ${creep.name} and ROLE: ${creep.memory.role}`)
            }

            // catching unexpected directives
            if (creep.memory.directive != 'harvestResources' && creep.memory.directive != 'useResources') {
                creep.memory.directive = 'useResources'
            }

        }

    }
}
