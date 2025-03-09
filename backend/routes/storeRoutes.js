/**
 * Store Routes
 * 
 * This file defines the API routes for store management functionality.
 * 
 * Features:
 * - GET /stores - Retrieve all stores
 * - POST /stores - Create a new store
 * - DELETE /stores/:id - Delete a store by ID
 * 
 * These endpoints allow the application to manage store data including
 * creating new stores, listing all stores, and removing stores from the system.
 */
import express from 'express';
import { getAllStores, createStore, deleteStore } from '../controllers/storeController.js';

const router = express.Router();

// Store routes
router.get('/', getAllStores).post('/', createStore);
router.delete('/:id', deleteStore);

export default router;