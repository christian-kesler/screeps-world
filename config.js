module.exports = {
    strategies: {
        0: {
            roles: {
                nurse: {
                    density: 0.4,
                    body: [MOVE, MOVE, WORK, CARRY, CARRY],
                },
                upgrader: {
                    density: 0.3,
                    body: [MOVE, MOVE, WORK, CARRY, CARRY],
                },
                engineer: {
                    density: 0.3,
                    body: [MOVE, MOVE, WORK, CARRY, CARRY],
                },
            },
            default_role: 'nurse'
        },
        1: {
            roles: {
                harvester: {
                    density: 0.4,
                    body: [MOVE, WORK, WORK, CARRY],
                },
                nurse: {
                    density: 0.1,
                    body: [MOVE, MOVE, WORK, CARRY, CARRY],
                },
                upgrader: {
                    density: 0.2,
                    body: [MOVE, MOVE, WORK, CARRY, CARRY],
                },
                engineer: {
                    density: 0.3,
                    body: [MOVE, MOVE, WORK, CARRY, CARRY],
                },
            },
            default_role: 'harvester'
        },
    }
}
