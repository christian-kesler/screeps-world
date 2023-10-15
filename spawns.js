const generateStrategyBasedOnRoomCapacity = (capacity) => {
    if (capacity % 50 == 0) {
        let body = []

        for (let i = capacity; i >= 200; i -= 200) {
            body.push(MOVE)
            body.push(WORK)
            body.push(WORK)
            body.push(CARRY)
        }

        // if (capacity % 200 >= 150) {
        //     body.push(MOVE)
        //     body.push(WORK)
        // } else if (capacity % 200 >= 100) {
        //     body.push(WORK)
        // } else if (capacity % 200 >= 50) {
        //     body.push(CARRY)
        // }

        return body
    } else {
        console.log("UNUSUAL ROOM CAPACITY OF " + capacity + " RECEVIED")
        return null
    }
}

module.exports = {
    spawnCreepWithRole: (role, spawn) => {
        // defining spawn if not present
        spawn = spawn || Game.spawns[Object.keys(Game.spawns)[0]];

        // making sure there is at least one creep
        if (Object.keys(Game.creeps).length == 0) {
            spawn.spawnCreep(
                [WORK, WORK, MOVE, CARRY],
                `STARTER_${Game.spawns[Object.keys(Game.spawns)[0]].name}_${Game.time}`,
                { memory: { role: 'nurse' } }
            )
        }

        const extensions = spawn.room.find(FIND_MY_STRUCTURES, { filter: (structure) => structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN });
        const extensionCapacity = extensions.reduce((capacity, extension) => capacity + extension.store.getCapacity(RESOURCE_ENERGY), 0);
        const totalCapacity = spawn.store.getCapacity(RESOURCE_ENERGY) + extensionCapacity;

        console.log(1100, generateStrategyBasedOnRoomCapacity(1100))
        spawn.spawnCreep(
            generateStrategyBasedOnRoomCapacity(totalCapacity),
            `${role}_${spawn.name}_${Game.time}`,
            { memory: { role: role } }
        );
    }
}

// 1100 move,work,work,carry,move,work,work,carry,move,work,work,carry,move,work,work,carry,move,work,work,carry,work
