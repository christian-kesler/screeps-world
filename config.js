module.exports = {
    strategy: {
        roles: {
            harvester: {
                density: 0.4
            },
            nurse: {
                density: 0.2,
            },
            upgrader: {
                density: 0.2,
            },
            engineer: {
                density: 0.2,
            },
        },
        default_role: 'harvester'
    }
}
