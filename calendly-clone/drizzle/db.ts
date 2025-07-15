// Initial neon client using database_url from env
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'
const sql = neon(process.env.DATABASE_URL!)

// create and export the drizzle ORM instance , with the neon 
// client and schema for type safe queries
export const db = drizzle(sql,{schema})