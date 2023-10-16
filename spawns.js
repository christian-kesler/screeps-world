module.exports = {
    spawnLoop: () => {

        for (var name in Game.spawns) {

            Game.spawns[name].spawnCreep(
                // body
                [MOVE, MOVE, WORK, CARRY, CARRY],
                // name
                `nurse_${name}_${Game.time}`,
                // options
                { memory: { role: 'nurse' } }
            )
        }
    }
}