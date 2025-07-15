// Define the "events" table with fields 
// like name , description , duration

import { pgTable , uuid , text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core"

const createdAt = timestamp("createdAt").notNull().defaultNow()
const updatedAt = timestamp("updatedAt").notNull().defaultNow()
.$onUpdate(() => new Date())

export const EventTable = pgTable(
    "events",
    {
        id : uuid("id").primaryKey().defaultRandom(),
        name : text("name").notNull(),
        description : text("description"),
        durationInMinutes : integer("durationInMinute").notNull(),
        clearkUserId : text('clerkUserId').notNull(),
        isActive : boolean("isActive").notNull().default(true),
        createdAt ,
        updatedAt ,

    },
    table => (
        [
            index("clearkUserIdIndex").on(table.clearkUserId)
        ]
    )
)

export const SceduleTable = pgTable("schedules" , {
    id : uuid("id").primaryKey().defaultRandom(),
    timezone : text("timezone").notNull(),
    clearkUserId : text('clerkUserId').notNull().unique(),
    createdAt ,
    updatedAt ,
})

