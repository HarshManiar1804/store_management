import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 4000;

// Check if port is free
import net from "net";
const server = net.createServer();
server.once("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.log(`❌ Port ${PORT} is already in use. Use a different port.`);
    process.exit(1);
  }
});

server.once("listening", () => {
  server.close();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

server.listen(PORT);
