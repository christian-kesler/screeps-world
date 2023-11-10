module.exports = {
    plotRoadsBetweenStructures: () => {
        // loop over all rooms
        console.log(1)
        for (var roomName in Game.rooms) {
            console.log(2)
            const room = Game.rooms[roomName]

            let spawns = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_SPAWN }
            });

            console.log(spawns)
            // const extensions = room.find(FIND_MY_STRUCTURES, {
            //     filter: { structureType: STRUCTURE_EXTENSION }
            // });
            let sources = room.find(FIND_SOURCES_ACTIVE)

            for (var spawnName in spawns) {
                console.log(3)
                const spawn = spawns[spawnName]

                for (var sourceName in sources) {
                    console.log(4)
                    const source = sources[sourceName]

                    const directions = spawn.pos.findPathTo(source)

                    for (let i = 0; i < directions.length; i++) {
                        console.log(JSON.stringify(directions[i]))
                        room.createConstructionSite(directions[i].x, directions[i].y, STRUCTURE_ROAD);
                    }
                }
            }
        }
    }
}