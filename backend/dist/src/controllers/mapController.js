import { sql } from "../config/db.js";
// map and location CRUD operations
export const getMaps = async (req, res) => {
    try {
        const maps = await sql `
            SELECT * FROM maps
            ORDER BY total_plays DESC
        `;
        console.log("fetched maps", maps);
        res.status(200).json({ successStatus: true, data: maps });
    }
    catch (error) {
        console.log("Error in getMaps function", error);
        res.status(500).json({ successStatus: false, message: "Internal Server Error" });
    }
};
export const createMap = async (req, res) => {
    const { mapName, desc, locationList, mapCreator } = req.body;
    if (!mapName || !locationList) {
        res.status(400).json({ successStatus: false, message: "All fields are required" });
        return;
    }
    try {
        let newMap;
        if (mapCreator.trim().toLowerCase() === "guest") {
            newMap = await sql `
                INSERT INTO maps (map_name, description)
                VALUES (${mapName}, ${desc})
                RETURNING *
            `;
        }
        else {
            newMap = await sql `
                INSERT INTO maps (map_name, map_creator, description)
                VALUES (${mapName}, ${mapCreator}, ${desc})
                RETURNING *
            `;
        }
        const mapId = newMap[0].id;
        for (const locId of locationList) {
            const loc = await getLocation(locId);
            if (!loc) {
                await addLocation(locId);
            }
            const junctionMapping = await addLocationToMap(mapId, locId);
        }
        console.log("new map added", newMap);
        res.status(201).json({ successStatus: true, data: newMap[0] });
    }
    catch (error) {
        console.log("Error in createMap function", error);
        res.status(500).json({ successStatus: false, message: "Internal Server Error" });
    }
};
const getLocation = async (image_id) => {
    const loc = await sql `
        SELECT 1 FROM locations WHERE image_id=${image_id}
    `;
    if (loc.length > 0) {
        return loc[0];
    }
    return null;
};
const addLocation = async (image_id) => {
    try {
        const newLoc = await sql `
            INSERT INTO locations (image_id)
            VALUES (${image_id})
            ON CONFLICT (image_id) DO NOTHING
            RETURNING *
        `;
        console.log("new location added:", newLoc);
    }
    catch (error) {
        console.log("error in addLocation function:", error);
    }
};
const addLocationToMap = async (map_id, image_id) => {
    try {
        const newJunctionMapping = await sql `
            INSERT INTO map_locations (map_id, location_id)
            VALUES (${map_id}, ${image_id})
            ON CONFLICT DO NOTHING
            RETURNING *
        `;
        console.log("new location added to map:", newJunctionMapping);
    }
    catch (error) {
        console.log("error in addLocationToMap function:", error);
    }
};
const getMapLocations = async (mapId) => {
    try {
        const locations = await sql `
            SELECT location_id FROM map_locations WHERE map_id=${mapId}
        `;
        console.log("fetched map locations", locations);
        return locations;
    }
    catch (error) {
        console.log("Error in getMapLocations function", error);
        return null;
    }
};
export const getNumRandomLocations = async (req, res) => {
    const { mapId, numLocations } = req.params;
    try {
        const map_locations = await sql `
            SELECT location_id FROM map_locations WHERE map_id=${mapId} ORDER BY RANDOM() LIMIT ${numLocations}
        `;
        if (!map_locations) {
            res.status(500).json({ successStatus: false, message: "Internal Server Error" });
        }
        else {
            res.status(200).json({ successStatus: true, locations: map_locations });
        }
    }
    catch (error) {
        console.log("Error in getMap function", error);
        res.status(500).json({ successStatus: false, message: "Internal Server Error" });
    }
};
export const getMapInfo = async (req, res) => {
    const { mapId } = req.params;
    try {
        const map = await sql `
            SELECT * FROM maps WHERE id=${mapId}
        `;
        console.log("fetched map", map);
        const map_locations = await getMapLocations(mapId);
        if (!map_locations) {
            res.status(500).json({ successStatus: false, message: "Internal Server Error" });
        }
        else {
            res.status(200).json({ successStatus: true, data: map[0], locations: map_locations });
        }
    }
    catch (error) {
        console.log("Error in getMap function", error);
        res.status(500).json({ successStatus: false, message: "Internal Server Error" });
    }
};
const deleteMapLocationsNotInList = async (mapId, locationIds) => {
    try {
        const locationIdsString = locationIds.toString();
        const deletedMap = await sql `
            DELETE FROM map_locations WHERE map_id=${mapId} AND location_id NOT IN (${locationIdsString})
        `;
        if (deletedMap.length === 0) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.log("Error in deleteMap function", error);
        return false;
    }
};
export const updateMap = async (req, res) => {
    const { mapId } = req.params;
    const { mapName, desc, locationList } = req.body;
    try {
        await deleteMapLocationsNotInList(Number(mapId), locationList);
        const updateMap = await sql `
            UPDATE maps
            SET map_name=${mapName}, description=${desc}
            WHERE id=${mapId}
            RETURNING *
        `;
        if (updateMap.length === 0) {
            res.status(404).json({ successStatus: false, message: "Map not found" });
            return;
        }
        for (const locId of locationList) {
            const loc = await getLocation(locId);
            if (!loc) {
                await addLocation(locId);
            }
            const junctionMapping = await addLocationToMap(Number(mapId), locId);
        }
        res.status(200).json({ successStatus: true, data: updateMap[0] });
    }
    catch (error) {
        console.log("Error in updateMap function", error);
        res.status(500).json({ successStatus: false, message: "Internal Server Error" });
    }
};
export const updateMapPlays = async (req, res) => {
    const { mapId } = req.params;
    const { newPlays } = req.body;
    try {
        const updateMap = await sql `
            UPDATE maps
            SET total_plays=${newPlays}
            WHERE id=${mapId}
            RETURNING *
        `;
        if (updateMap.length === 0) {
            res.status(404).json({ successStatus: false, message: "Map not found" });
            return;
        }
        res.status(200).json({ successStatus: true, data: updateMap[0] });
    }
    catch (error) {
        console.log("Error in updateMapPlays function", error);
        res.status(500).json({ successStatus: false, message: "Internal Server Error" });
    }
};
export const deleteMap = async (req, res) => {
    const { mapId } = req.params;
    try {
        const deletedMap = await sql `
            DELETE FROM maps WHERE id=${mapId} RETURNING *
        `;
        if (deletedMap.length === 0) {
            res.status(404).json({ successStatus: false, message: "Map not found" });
            return;
        }
        res.status(200).json({ successStatus: true, data: deletedMap[0] });
    }
    catch (error) {
        console.log("Error in deleteMap function", error);
        res.status(500).json({ successStatus: false, message: "Internal Server Error" });
    }
};
