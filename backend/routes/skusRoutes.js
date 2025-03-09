/**
 * SKUs Routes
 * 
 * This file defines the API routes for SKU (Stock Keeping Unit) management functionality.
 * 
 * Features:
 * - GET /skus - Retrieve all SKUs
 * - POST /skus - Create a new SKU
 * - DELETE /skus/:id - Delete a SKU by ID
 * 
 * These endpoints allow the application to manage product SKU data including
 * creating new SKUs, listing all SKUs, and removing SKUs from the system.
 * SKUs represent individual products with attributes like class, department, price, and cost.
 */
import express from "express";
import {
  createSKU,
  deleteSKU,
  getAllSKUs,
} from "../controllers/skusController.js";

const router = express.Router();
// Store routes
router.get("/", getAllSKUs).post("/", createSKU);
router.delete("/:id", deleteSKU);

export default router;
