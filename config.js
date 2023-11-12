module.exports = {
    strategies: {
        0: {
            roles: {
                nurse: {
                    density: 0.4,
                    body: {
                        maximize: [CARRY, MOVE],
                        minimize: [WORK]
                    },
                },
                upgrader: {
                    density: 0.3,
                    body: {
                        maximize: [CARRY, MOVE],
                        minimize: [WORK]
                    },
                },
                engineer: {
                    density: 0.3,
                    body: {
                        maximize: [CARRY, WORK],
                        minimize: [MOVE]
                    },
                },
                harvester: {
                    density: 0,
                    body: {
                        maximize: [WORK],
                        minimize: [CARRY, MOVE]
                    },
                },
            },
            default_role: 'nurse'
        },
        1: {
            roles: {
                harvester: {
                    density: 0.2,
                    body: {
                        maximize: [WORK],
                        minimize: [CARRY, MOVE]
                    },
                },
                nurse: {
                    density: 0.2,
                    body: {
                        maximize: [CARRY, MOVE],
                        minimize: [WORK]
                    },
                },
                upgrader: {
                    density: 0.3,
                    body: {
                        maximize: [CARRY, MOVE],
                        minimize: [WORK]
                    },
                },
                engineer: {
                    density: 0.3,
                    body: {
                        maximize: [CARRY, WORK],
                        minimize: [MOVE]
                    },
                },
            },
            default_role: 'harvester'
        },
    }
}
