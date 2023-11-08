const { strategies } = require('./config')

module.exports = {
    conductRoomCreepCensus: () => {

        // iterating over rooms
        for (var name in Game.rooms) {

            // defining variables
            let room = Game.rooms[name]
            let creeps = room.find(FIND_MY_CREEPS)
            let census = {
                total: 0
            }

            // iterating over creeps
            for (let i = 0; i < creeps.length; i++) {
                let creep = creeps[i]

                // adding to census
                if (census[creep.memory.role] == undefined) {
                    census[creep.memory.role] = {
                        count: 1
                    }
                } else {
                    census[creep.memory.role].count += 1
                }
                census.total += 1
            }

            // calculating creep population densities
            for (var role in census) {
                if (role != 'total') {
                    census[role].density = census[role].count / census.total
                }
            }

            // saving to room memory
            room.memory.creepCensus = census
        }
    },

    conductRoomStructureCensus: () => {

        // iterating over rooms
        for (var name in Game.rooms) {

            // defining variables
            let room = Game.rooms[name]
            let structures = room.find(FIND_MY_STRUCTURES)
            let census = {
                total: 0
            }

            // iterating over structures
            for (let i = 0; i < structures.length; i++) {
                let structure = structures[i]

                // console.log(JSON.stringify(structure))

                // adding to census
                if (census[structure.structureType] == undefined) {
                    census[structure.structureType] = {
                        count: 1
                    }
                } else {
                    census[structure.structureType].count += 1
                }
                census.total += 1
            }

            // saving to room memory
            room.memory.structureCensus = census

        }
    },

    generateSpawnDirective: (spawn) => {

        // TODO
        // consider theoretical max creep size based on extensions
        // consider practical max creep size based on population

        // defining variables
        let strategyCode = Math.floor(spawn.room.memory.strategyCode)
        let structureCensus = spawn.room.memory.structureCensus
        let creepCensus = spawn.room.memory.creepCensus
        let spawnScalar = 0
        let directive = []

        // identify theoretical max creep spawn based on available extensions
        let spawnTheoreticalCapacity = 300
        let spawnPracticalCapacity = 300
        spawnTheoreticalCapacity += structureCensus.extension.count * 50

        // identify practical max creep size based on population
        if(creepCensus.total > 10) {
            spawnScalar = 1.0
        } else {
            spawnScalar = creepCensus.total / 10
            console.log(spawnScalar)
        }

        spawnPracticalCapacity = spawnTheoreticalCapacity * spawnScalar
        console.log(spawnPracticalCapacity)
        spawnPracticalCapacity = spawnPracticalCapacity - (spawnPracticalCapacity % 50)
        console.log(spawnPracticalCapacity)
        
        if (creepCensus.total == 0) {
            // if no creeps found

            // spawn default creep
            directive.push({
                "action": "spawn_creep",
                "role": strategies[strategyCode].default_role,
            })
            return directive
        } else {
            // if creeps found

            let mostInNeedOfSpawn = {
                densityRatio: 0
            }

            // iterate over roles
            for (role in strategies[strategyCode].roles) {

                // if role not in creepCensus, define as empty
                if (creepCensus[role] == null) creepCensus[role] = { "count": 0, "density": 0 }

                // if creepCensus density is lower than strategy demands, spawn creep of said role
                if (strategies[strategyCode].roles[role].density > creepCensus[role].density) {
                    let currentDensityRatio = strategies[strategyCode].roles[role].density / creepCensus[role].density
                    if (currentDensityRatio > mostInNeedOfSpawn.densityRatio) {
                        mostInNeedOfSpawn = {
                            densityRatio: currentDensityRatio,
                            role: role,
                            body: strategies[strategyCode].roles[role].body,
                        }
                    }
                }
            }

            directive.push({
                "action": "spawn_creep",
                "role": mostInNeedOfSpawn.role,
                "body": mostInNeedOfSpawn.body,
            })

            // if no other directive priorities, spawn default
            if (directive.length == 0) {
                directive.push({
                    "action": "spawn_creep",
                    "role": strategies[strategyCode].default_role
                })
            }

            return directive
        }
    },

    generateRoomStrategy: () => {

        // iterate over rooms
        for (var name in Game.rooms) {
            let room = Game.rooms[name]
            let creepCensus = room.memory.creepCensus

            // find my containers
            let containers = room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            })

            // determine room strategy code
            if (containers.length == 0) {
                room.memory.strategyCode = 0
            } else if (creepCensus.harvester.count == 0) {
                room.memory.strategyCode = 1.1
            } else {
                room.memory.strategyCode = 1.2
            }
        }
    }
}