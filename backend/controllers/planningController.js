import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPlanningData = async (req, res) => {
  try {
    const { storeId } = req.params;

    // Execute raw SQL query
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
