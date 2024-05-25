import  { Config, defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// export default {
//   dialect :"postgresql",
//   schema: "./src/lib/db/schema.ts",
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
// } satisfies Config;
export default defineConfig({
    dialect :"postgresql",
    schema: "./src/lib/db/schema.ts",
    dbCredentials: {
      url: process.env.DATABASE_URL!,
    },
})

// npx drizzle-kit push:pg