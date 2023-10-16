const moveToOpt = {
    visualizePathStyle: {
        fill: 'transparent',
        stroke: '#fff',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .5
    }
}

module.exports = {
    creepLoop: () => {

        for (var name in Game.creeps) {

            let creep = Game.creeps[name]
            let sources = creep.room.find(FIND_SOURCES_ACTIVE)

            if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.directive = 'harvestResources'
            } else if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                creep.memory.directive = 'transferResources'
            }

            if (creep.memory.directive == 'transferResources') {
                if (creep.transfer(Game.spawns['spawn1'], RESOURCE_ENERGY) == -9) {
                    creep.moveTo(Game.spawns['spawn1'], moveToOpt)
                }
            } else if (creep.memory.directive == 'harvestResources') {
                if (creep.harvest(sources[0]) == -9) {
                    creep.moveTo(sources[0], moveToOpt)
                }
            } else {
                creep.memory.directive = 'transferResources'
            }
        }

    }
}