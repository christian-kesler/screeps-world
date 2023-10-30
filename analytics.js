module.exports = {
    creepCensus: (creeps) => {
        census = {
            total: 0
        }

        for (var name in Game.creeps) {
            if (census[Game.creeps[name].memory.role] == undefined) {
                census[Game.creeps[name].memory.role] = {
                    count: 1
                }
            } else {
                census[Game.creeps[name].memory.role].count += 1
            }
            census.total += 1
        }

        for (var role in census) {
            if (role != 'total') {
                census[role].density = census[role].count / census.total
            }
        }

        return census
    },

    generateSpawnDirective: (strategy, census) => {
        directive = []

        if (census.total == 0) {
            directive.push({
                "action": "spawn_creep",
                "role": strategy.default_role
            })
            return directive
        } else {
            for (role in strategy.roles) {

                if (census[role] == null) census[role] = { "count": 0, "density": 0 }

                if (strategy.roles[role].density > census[role].density) {
                    directive.push({
                        "action": "spawn_creep",
                        "role": role
                    })
                }
            }

            if (directive.length == 0) {
                directive.push({
                    "action": "spawn_creep",
                    "role": strategy.default_role
                })
            }
            return directive
        }
    }
}