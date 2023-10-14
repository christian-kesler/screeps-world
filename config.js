module.exports = {
    strategy: {
        "role_ratios": {
            "harvester": 0.4,
            "builder": 0.2,
            "upgrader": 0.4
        },
        "role_definitions": {
            "harvester": [WORK, CARRY, MOVE],
            "builder": [WORK, CARRY, MOVE],
            "upgrader": [WORK, CARRY, MOVE]
        },
        "default_new_role": "harvester"
    }
}
