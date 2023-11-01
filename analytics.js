const { strategies } = require('./config')

module.exports = {
    conductRoomCensus: () => {

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
            room.memory.census = census
        }
    },

    generateSpawnDirective: (spawn) => {

        // defining variables
        let strategyCode = spawn.room.memory.strategy
        let census = spawn.room.memory.census
        let directive = []

        if (census.total == 0) {
            // if no creeps found

            // spawn default creep
            directive.push({
                "action": "spawn_creep",
                "role": strategies[strategyCode].default_role
            })
            return directive
        } else {
            // if creeps found

            // iterate over roles
            for (role in strategies[strategyCode].roles) {

                // if role not in census, define as empty
                if (census[role] == null) census[role] = { "count": 0, "density": 0 }

                // if census density is lower than strategy demands, spawn creep of said role
                if (strategies[strategyCode].roles[role].density > census[role].density) {
                    directive.push({
                        "action": "spawn_creep",
                        "role": role
                    })
                }
            }

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

            // find my containers
            let containers = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            })

            // determine room strategy code
            if (containers.length == 0) {
                room.memory.strategyCode = 0
            } else {
                room.memory.strategyCode = 1
            }
        }
    }
}