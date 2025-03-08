import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import storeRoutes from "./routes/storeRoutes.js";
import skusRoutes from "./routes/skusRoutes.js";
dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/stores", storeRoutes);
app.use("/skus", skusRoutes);

app.get("/", (req, res) => {
  res.send("Gsynergy server is running");
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
