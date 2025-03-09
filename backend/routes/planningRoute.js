/**
 * Planning Routes
 * 
 * This file defines the API routes for planning data functionality.
 * 
 * Features:
 * - GET /planning/:storeId - Retrieve planning data for a specific store
 * 
 * This endpoint allows the application to fetch planning data including sales units
 * for SKUs in a specific store across different time periods (weeks/months).
 * The data is used for sales analysis and forecasting in the application.
 */
import express from "express";
import { getPlanningData } from "../controllers/planningController.js";
const router = express.Router();

// API to fetch store data based on storeId
router.get("/:storeId", getPlanningData);
export default router;
