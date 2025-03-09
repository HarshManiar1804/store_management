/**
 * Store Controller
 * 
 * This file contains controller functions for managing store data in the application.
 * It handles the business logic for store operations including retrieving, creating,
 * and deleting stores.
 * 
 * Features:
 * - getAllStores: Retrieves all stores from the database
 * - createStore: Creates a new store with validation for required fields and ID format
 * - deleteStore: Removes a store by its ID
 * 
 * The store model includes fields for ID, label, city, and state.
 * Store IDs must follow the format starting with "ST" prefix.
 */
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all stores from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllStores = async (req, res) => {
  try {
    const stores = await prisma.store.findMany();
    res.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new store
 * @param {Object} req - Express request object with store data in body
 * @param {Object} res - Express response object
 */
export const createStore = async (req, res) => {
  try {
    const { id, label, city, state } = req.body;

    // Validate required fields
    if (!id || !label || !city || !state) {
      return res
        .status(400)
        .json({ error: "id, label, city, and state are required fields" });
    }

    // Validate store ID format
    if (!id.startsWith("ST")) {
      return res
        .status(400)
        .json({ error: "Store ID must start with 'ST' prefix" });
    }

    // Check if store ID already exists
    const existingStore = await prisma.store.findUnique({
      where: { id },
    });

    if (existingStore) {
      return res.status(400).json({ error: "Store ID already exists" });
    }

    const newStore = await prisma.store.create({
      data: {
        id,
        label,
        city,
        state,
      },
    });

    res.status(201).json(newStore);
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete a store by ID
 * @param {Object} req - Express request object with store ID in params
 * @param {Object} res - Express response object
 */
export const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.store.delete({
      where: { id },
    });
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
