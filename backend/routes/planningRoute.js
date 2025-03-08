import express from "express";
import { getPlanningData } from "../controllers/planningController.js";
const router = express.Router();

// API to fetch store data based on storeId
router.get("/:storeId", getPlanningData);
export default router;
