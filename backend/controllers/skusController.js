/**
 * SKUs Controller
 * 
 * This file contains controller functions for managing SKU (Stock Keeping Unit) data in the application.
 * It handles the business logic for SKU operations including retrieving, creating,
 * and deleting SKUs.
 * 
 * Features:
 * - getAllSKUs: Retrieves all SKUs from the database
 * - createSKU: Creates a new SKU with validation for required fields and ID format
 * - deleteSKU: Removes a SKU by its ID
 * 
 * The SKU model includes fields for ID, label, class, department, price, and cost.
 * SKU IDs must follow the format starting with "SK" prefix.
 */
import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all SKUs from the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllSKUs = async (req, res) => {
  try {
    const skus = await prisma.sKUs.findMany();
    res.json(skus);
  } catch (error) {
    console.error("Error fetching skus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new SKU
 * @param {Object} req - Express request object with SKU data in body
 * @param {Object} res - Express response object
 */
export const createSKU = async (req, res) => {
  try {
    const { id, label, class: skuClass, department, price, cost } = req.body;

    // Validate required fields
    if (!id || !label || !skuClass || !department || !price || !cost) {
      return res.status(400).json({
        error:
          "id, label, class, department, price and cost are required fields",
      });
    }

    // Validate store ID format
    if (!id.startsWith("SK")) {
      return res
        .status(400)
        .json({ error: "SKU ID must start with 'SK' prefix" });
    }

    // Check if store ID already exists
    const existingSKU = await prisma.sKUs.findUnique({
      where: { id },
    });

    if (existingSKU) {
      return res.status(400).json({ error: "SKU ID already exists" });
    }

    const newStore = await prisma.sKUs.create({
      data: {
        id,
        label,
        class: skuClass,
        department,
        price,
        cost,
      },
    });

    res.status(201).json(newStore);
  } catch (error) {
    console.error("Error creating SKUs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete a SKU by ID
 * @param {Object} req - Express request object with SKU ID in params
 * @param {Object} res - Express response object
 */
export const deleteSKU = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sKUs.delete({
      where: { id },
    });
    res.json({ message: "SKUs deleted successfully" });
  } catch (error) {
    console.error("Error deleting SKUs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
