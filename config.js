module.exports = {
    strategies: {
        0: {
            roles: {
                nurse: {
                    density: 0.4,
                },
                upgrader: {
                    density: 0.3,
                },
                engineer: {
                    density: 0.3,
                },
            },
            default_role: 'nurse'
        },
        1: {
            roles: {
                harvester: {
                    density: 0.4
                },
                nurse: {
                    density: 0.1,
                },
                upgrader: {
                    density: 0.2,
                },
                engineer: {
                    density: 0.3,
                },
            },
            default_role: 'harvester'
        },
    }
}
