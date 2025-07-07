import express from "express";
import {
    getMaps, 
    createMap, 
    getMapInfo, 
    updateMap, 
    deleteMap,
    getNumRandomLocations,
} from "../controllers/mapController.ts";

const router = express.Router();

router.get("/maps", getMaps);
router.get("/maps/:mapId", getMapInfo);
router.get("/maps/:mapId/random_locs/:numLocations", getNumRandomLocations);
router.post("/maps", createMap);
router.put("/maps/:mapId", updateMap);
router.delete("/maps/:mapId", deleteMap);

export default router;