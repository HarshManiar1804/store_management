/**
 * Main Server Entry Point
 * 
 * This file initializes and configures the Express server for the GSynergy application.
 * It sets up middleware, defines routes, and starts the server.
 * 
 * Features:
 * - Environment configuration using dotenv
 * - CORS support for cross-origin requests
 * - JSON parsing middleware
 * - API routes for stores, SKUs, and planning data
 */
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import storeRoutes from "./routes/storeRoutes.js";
import skusRoutes from "./routes/skusRoutes.js";
import planningRoutes from "./routes/planningRoute.js";
dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/stores", storeRoutes);
app.use("/skus", skusRoutes);
app.use("/planning", planningRoutes);

app.get("/", (req, res) => {
  res.send("Gsynergy server is running");
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
