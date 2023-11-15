module.exports = {
    plotRoadsFromSpawnsToSources: () => {
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

                    for (let i = 0; i < directions.length - 1; i++) {
                        room.createConstructionSite(directions[i].x, directions[i].y, STRUCTURE_ROAD);
                    }
                }
            }
        }
    },
    plotRoadsFromSourcesToController: () => {
        // loop over all rooms
        for (var roomName in Game.rooms) {
            const room = Game.rooms[roomName]

            let sources = room.find(FIND_SOURCES_ACTIVE)

            for (var sourceName in sources) {
                const source = sources[sourceName]

                const directions = source.pos.findPathTo(room.controller, { ignoreCreeps: true, ignoreRoads: true })

                for (let i = 0; i < directions.length - 1; i++) {
                    room.createConstructionSite(directions[i].x, directions[i].y, STRUCTURE_ROAD);
                }
            }

        }
    },
    plotExtentionsFromSpawns: () => {
        // loop over all rooms
        for (var roomName in Game.rooms) {
            const room = Game.rooms[roomName]

            let spawns = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_SPAWN }
            });

            for (var spawnName in spawns) {
                const spawn = spawns[spawnName]

                for (let i = 1; i <= 8; i++) {
                    room.createConstructionSite(spawn.pos.x + i, spawn.pos.y + i, STRUCTURE_EXTENSION);
                    room.createConstructionSite(spawn.pos.x - i, spawn.pos.y + i, STRUCTURE_EXTENSION);
                    room.createConstructionSite(spawn.pos.x + i, spawn.pos.y - i, STRUCTURE_EXTENSION);
                    room.createConstructionSite(spawn.pos.x - i, spawn.pos.y - i, STRUCTURE_EXTENSION);
                }
            }
        }
    },
    plotContainersFromSources: () => {
        // loop over all rooms
        for (var roomName in Game.rooms) {
            const room = Game.rooms[roomName]

            let sources = room.find(FIND_SOURCES)

            for (var sourceName in sources) {
                const source = sources[sourceName]

                // let plotted = 0
                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {

                        source.pos.x = source.pos.x + x
                        source.pos.y = source.pos.y + y

                        const structures = source.pos.lookFor(LOOK_STRUCTURES)

                        // iterate over structures and count completed containers as plotted

                        // if (plotted < 2) {
                        //     if (room.createConstructionSite(source.pos.x + x, source.pos.y + y, STRUCTURE_CONTAINER) == 0) {
                        //         plotted++
                        //     }
                        // }

                        source.pos.x = source.pos.x - x
                        source.pos.y = source.pos.y - y
                    }
                }
            }
        }
    }

}