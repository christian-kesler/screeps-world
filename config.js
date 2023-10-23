module.exports = {
    strategy: {
        roles: {
            nurse: {
                density: 0.4,
            },
            upgrader: {
                density: 0.4,
            },
            engineer: {
                density: 0.2,
            },
        },
        max_creeps: 10,
        default_role: 'nurse'
    }
}
