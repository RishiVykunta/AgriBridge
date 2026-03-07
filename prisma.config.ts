import "dotenv/config";
import { defineConfig } from "prisma/config";

// Use process.env for prisma generate (no DB needed); env() throws when var is missing
const databaseUrl = process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
