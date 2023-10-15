module.exports = {
    conductCensus: (creeps) => {
        census = {
            "total": 0
        }
        for (var name in Game.creeps) {
            creep = Game.creeps[name]

            if (census[creep.memory.role] == undefined) {
                census[creep.memory.role] = 1
                census['total'] = census['total'] + 1
            } else {
                census[creep.memory.role] = census[creep.memory.role] + 1
                census['total'] = census['total'] + 1
            }
        }
        return census
    },

    generateDirective: (strategy, census) => {
        directive = []

        for (role in strategy.role_ratios) {
            if (census[role] == null) census[role] = 0
            current_ratio = census[role] / census['total']
            desired_ratio = strategy.role_ratios[role]

            console.log(role, current_ratio, desired_ratio)
            if (desired_ratio > current_ratio) {
                directive.push({
                    "action": "spawn_creep",
                    "role": role
                })
            }
        }
        return directive
    }
}