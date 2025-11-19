import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Use a direct, non-pooled URL for migrations to avoid PgBouncer issues
    url: env("DIRECT_URL"),
  },
});
