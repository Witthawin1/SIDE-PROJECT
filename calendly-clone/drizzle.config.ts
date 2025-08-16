import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL
if(!databaseUrl){
    throw new Error("DATABASE_URL is not defined in env varaibles.")
}

export default defineConfig({
  out: "./drizzle/migrations",
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",

  strict: true,
  verbose: true,

  dbCredentials:{
    url : databaseUrl
  }
});
