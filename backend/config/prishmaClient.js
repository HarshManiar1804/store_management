/**
 * Prisma Client Configuration
 * 
 * This file creates and exports a singleton instance of the Prisma client
 * for database operations throughout the application.
 * 
 * The Prisma client provides an interface to interact with the PostgreSQL database
 * and is used by controllers to perform CRUD operations on the database models.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
