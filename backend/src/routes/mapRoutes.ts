import express from "express";
import {
    getMaps, 
    createMap, 
    getMapInfo, 
    updateMap, 
    deleteMap,
} from "../controllers/mapController.ts";

const router = express.Router();

router.get("/maps", getMaps);
router.get("/maps/:mapId", getMapInfo);
router.post("/maps", createMap);
router.put("/maps/:mapId", updateMap);
router.delete("/maps/:mapId", deleteMap);

export default router;