module.exports = {
    default: {
        "role_ratios": {
            "nurse": 0.4,
            "engineer": 0.2,
            "upgrader": 0.4
        },
        "role_definitions": {
            "nurse": [WORK, CARRY, MOVE],
            "engineer": [WORK, CARRY, MOVE],
            "upgrader": [WORK, CARRY, MOVE]
        },
        "default_new_role": "nurse"
    },
    rcl1: {
        "role_ratios": {
            "nurse": 0.5,
            "upgrader": 0.5
        },
        "role_definitions": {
            "nurse": [WORK, CARRY, MOVE],
            "upgrader": [WORK, CARRY, MOVE]
        },
        "default_new_role": "nurse"
    },
    rcl2: {
        "role_ratios": {
            "nurse": 0.4,
            "engineer": 0.2,
            "upgrader": 0.4
        },
        "role_definitions": {
            "nurse": [WORK, CARRY, CARRY, MOVE],
            "engineer": [WORK, WORK, CARRY, MOVE],
            "upgrader": [WORK, CARRY, MOVE, MOVE]
        },
        "default_new_role": "nurse"
    },
    rcl3: {
        "role_ratios": {
            "nurse": 0.4,
            "engineer": 0.2,
            "upgrader": 0.4
        },
        "role_definitions": {
            "nurse": [
                WORK, WORK, WORK,
                CARRY, CARRY, CARRY,
                MOVE
            ],
            "engineer": [
                WORK, WORK, WORK,
                CARRY, CARRY, CARRY,
                MOVE
            ],
            "upgrader": [
                WORK, WORK, WORK,
                CARRY, CARRY, CARRY,
                MOVE
            ]
        },
        "default_new_role": "nurse"
    },
    rcl4: {
        "role_ratios": {
            "nurse": 0.4,
            "engineer": 0.2,
            "upgrader": 0.4
        },
        "role_definitions": {
            "nurse": [WORK, CARRY, MOVE],
            "engineer": [WORK, CARRY, MOVE],
            "upgrader": [WORK, CARRY, MOVE]
        },
        "default_new_role": "nurse"
    }


}
