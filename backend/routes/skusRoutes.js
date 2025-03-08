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
