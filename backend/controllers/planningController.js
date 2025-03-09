/**
 * Planning Controller
 * 
 * This file contains controller functions for managing planning data in the application.
 * It handles the business logic for retrieving sales planning data for specific stores.
 * 
 * Features:
 * - getPlanningData: Retrieves planning data for a specific store, including SKU information
 *   and sales units across different time periods (weeks/months)
 * 
 * The planning data is retrieved using a complex SQL query that joins multiple tables:
 * - Store: Contains store information
 * - SKUs: Contains product information
 * - Planning: Contains sales units data
 * - Calendar: Contains time period information
 * 
 * The data is transformed into a structured format suitable for frontend visualization
 * and analysis, organizing sales data by SKU and time period.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get planning data for a specific store
 * @param {Object} req - Express request object with storeId in params
 * @param {Object} res - Express response object
 * @returns {Object} Transformed planning data organized by SKU with sales data by week
 */
export const getPlanningData = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Execute raw SQL query to join data from multiple tables
    const result = await prisma.$queryRaw`
                SELECT 
                    sk.id AS "sku_id",
                    sk.label AS "sku_name",
                    sk.price,
                    sk.cost,
                    c.week,
                    c.month,
                    p."salesUnits"
                FROM public."Store" s
                LEFT JOIN public."Planning" p ON s.id = p.store
                LEFT JOIN public."SKUs" sk ON p.sku = sk.id
                LEFT JOIN public."Calendar" c ON p.week = c.week
                WHERE p.store = ${storeId}
                ORDER BY c.week ASC;
            `;

    // Transforming data into the required structure
    // Organizes data by SKU with nested sales data by week
    const transformedData = result.reduce((acc, item) => {
      if (!acc[item.sku_name]) {
        acc[item.sku_name] = {
          sku_id: item.sku_id,
          sku_name: item.sku_name,
          price: item.price,
          cost: item.cost,
          salesData: [],
        };
      }

      acc[item.sku_name].salesData.push({
        week: item.week,
        salesUnits: item.salesUnits,
      });

      return acc;
    }, {});

    res.json({ success: true, data: transformedData });
  } catch (error) {
    console.error("Error fetching store data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
