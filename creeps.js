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
        if (creep.memory.directive == 'transferResources') {
            if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == -9) {
                creep.moveTo(Game.spawns['Spawn1'], moveToOpt)
            }
        }
    },
    engineer: (creep) => {
        if (creep.memory.directive == 'transferResources') {
            if (creep.memory.transferTargetId == null) {
                roads = creep.room.find(FIND_STRUCTURES, {
                    filter: { structureType: STRUCTURE_ROAD }
                })

                for (var name in roads) {
                    if (roads[name].hits <= 2000) {
                        creep.memory.transferTargetId = roads[name].id
                    }
                }

                if (creep.memory.transferTargetId == null) {
                    creep.memory.transferTargetId = Game.constructionSites[Object.keys(Game.constructionSites)[0]].id
                }

            } else {
                if (Game.getObjectById(creep.memory.transferTargetId).hits == 5000) {
                    creep.memory.transferTargetId = null
                }
                if (
                    creep.build(Game.getObjectById(creep.memory.transferTargetId)) == -9
                    ||
                    creep.repair(Game.getObjectById(creep.memory.transferTargetId)) == -9
                ) {
                    console.log("attempting move")
                    creep.moveTo(Game.getObjectById(creep.memory.transferTargetId), moveToOpt)
                }
            }
        }
    },
    upgrader: (creep) => {
        if (creep.memory.directive == 'transferResources') {
            if (creep.upgradeController(creep.room.controller) == -9) {
                creep.moveTo(creep.room.controller, moveToOpt)
            }
        }
    },
}

module.exports = {
    creepLoop: () => {

        for (var name in Game.creeps) {

            let creep = Game.creeps[name]
            let sources = creep.room.find(FIND_SOURCES_ACTIVE)

            richestEnergySource = sources[0]
            for (let i = 0; i < sources.length; i++) {
                if (sources[i].energy > richestEnergySource.energy) {
                    richestEnergySource = sources[i]
                }
            }

            try {
                if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.directive = 'harvestResources'
                    creep.memory.harvestTargetId = richestEnergySource.id
                } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.directive = 'transferResources'
                }

                if (creep.memory.directive == 'harvestResources') {
                    if (creep.harvest(Game.getObjectById(creep.memory.harvestTargetId)) == -9) {
                        creep.moveTo(Game.getObjectById(creep.memory.harvestTargetId), moveToOpt)
                    }
                }

                if (creep.memory.directive != 'harvestResources' && creep.memory.directive != 'transferResources') {
                    creep.memory.directive = 'transferResources'
                }

                creepBehaviorObject[creep.memory.role](creep)
            } catch (err) {
                console.log(err.message)
            }
        }
    }
}