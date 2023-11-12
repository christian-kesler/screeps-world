module.exports = {
    plotRoadsBetweenStructures: () => {
        // loop over all rooms
        for (var roomName in Game.rooms) {
            const room = Game.rooms[roomName]

            let spawns = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_SPAWN }
            });

            // const extensions = room.find(FIND_MY_STRUCTURES, {
            //     filter: { structureType: STRUCTURE_EXTENSION }
            // });

            let sources = room.find(FIND_SOURCES_ACTIVE)

            for (var spawnName in spawns) {
                const spawn = spawns[spawnName]

                for (var sourceName in sources) {
                    const source = sources[sourceName]

                    const directions = spawn.pos.findPathTo(source, { ignoreCreeps: true, ignoreRoads: true })

                    for (let i = 0; i < directions.length; i++) {
                        room.createConstructionSite(directions[i].x, directions[i].y, STRUCTURE_ROAD);
                    }
                }
            }
        }
    }
}