import express from 'express';
import { getAllStores, createStore, deleteStore } from '../controllers/storeController.js';

const router = express.Router();

// Store routes
router.get('/', getAllStores).post('/', createStore);
router.delete('/:id', deleteStore);

export default router;