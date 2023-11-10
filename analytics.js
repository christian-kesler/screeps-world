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

        // defining variables
        let strategyCode = Math.floor(spawn.room.memory.strategyCode)
        let structureCensus = spawn.room.memory.structureCensus
        let creepCensus = spawn.room.memory.creepCensus
        let directive = []

        // identify theoretical max creep size based on available extensions
        let spawnTheoreticalCapacity = 300
        let spawnScalar = 0
        let spawnPracticalCapacity = 300
        try {
            spawnTheoreticalCapacity += structureCensus.extension.count * 50
        } catch (err) { }

        // identify practical max creep size based on population
        if (creepCensus.total > 10) {
            spawnScalar = 1.0
        } else {
            spawnScalar = creepCensus.total / 10
        }

        spawnPracticalCapacity = Math.max(spawnTheoreticalCapacity * spawnScalar, 300)
        // spawnPracticalCapacity = spawnPracticalCapacity - (spawnPracticalCapacity % 50)

        if (creepCensus.total == 0) {
            // if no creeps found

            // spawn default creep
            directive = [{
                "action": "spawn_creep",
                "role": strategies[strategyCode].default_role,
                "body": [WORK, CARRY, MOVE]
            }]
            return directive
        } else {
            // if creeps found

            let mostInNeedOfSpawn = {
                densityRatio: 0,
                body: {}
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

            let creepBody = []
            let bodyEnergyCost = 0
            let incomplete = true

            for (let i = 0; i < mostInNeedOfSpawn.body.minimize.length; i++) {
                if (mostInNeedOfSpawn.body.minimize[i] == WORK) {
                    creepBody.push(mostInNeedOfSpawn.body.minimize[i])
                    bodyEnergyCost += 100
                } else if (
                    mostInNeedOfSpawn.body.minimize[i] == MOVE
                    ||
                    mostInNeedOfSpawn.body.minimize[i] == CARRY
                ) {
                    creepBody.push(mostInNeedOfSpawn.body.minimize[i])
                    bodyEnergyCost += 50
                }
            }

            while (incomplete) {
                for (let i = 0; i < mostInNeedOfSpawn.body.maximize.length; i++) {
                    if (mostInNeedOfSpawn.body.maximize[i] == WORK) {
                        creepBody.push(mostInNeedOfSpawn.body.maximize[i])
                        bodyEnergyCost += 100
                    } else if (
                        mostInNeedOfSpawn.body.maximize[i] == MOVE
                        ||
                        mostInNeedOfSpawn.body.maximize[i] == CARRY
                    ) {
                        creepBody.push(mostInNeedOfSpawn.body.maximize[i])
                        bodyEnergyCost += 50
                    }

                    if (bodyEnergyCost > spawnPracticalCapacity) {

                        if (mostInNeedOfSpawn.body.maximize[i] == WORK) {
                            creepBody.pop()
                            bodyEnergyCost -= 100
                            incomplete = false
                        } else if (
                            mostInNeedOfSpawn.body.maximize[i] == MOVE
                            ||
                            mostInNeedOfSpawn.body.maximize[i] == CARRY
                        ) {
                            creepBody.pop()
                            bodyEnergyCost -= 50
                            incomplete = false
                        }

                    }
                }
            }

            directive = [{
                "action": "spawn_creep",
                "role": mostInNeedOfSpawn.role,
                "body": creepBody,
            }]

            // if no other directive priorities, spawn default
            if (directive.length == 0) {
                directive = [{
                    "action": "spawn_creep",
                    "role": strategies[strategyCode].default_role
                }]
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