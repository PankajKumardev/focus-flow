import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Create the connection to the database
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

// Initialize Drizzle with the schema
export const db = drizzle(client, { schema });