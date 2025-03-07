import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Prisma
const prisma = new PrismaClient();

// API to fetch all stores
app.get("/stores", async (req , res) => {
    try {
        const stores = await prisma.store.findMany();
        res.json(stores);
    } catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/", (req, res) => {
    res.send("Hello World");
});
// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
