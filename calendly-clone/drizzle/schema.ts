// Define the "events" table with fields 
// like name , description , duration

import { DAYS_OF_WEEK_IN_ORDER } from "@/constants"
import { relations } from "drizzle-orm"
import { pgTable , uuid , text, integer, boolean, timestamp, index, pgEnum } from "drizzle-orm/pg-core"
import { availableMemory } from "process"

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

export const scheduleRelations = relations(SceduleTable , ({many}) => ({
    availabilities : many(ScheduleAvailabilityTable)
}))

export const scheduleDayOfWeekEnum = pgEnum("day",DAYS_OF_WEEK_IN_ORDER)

export const ScheduleAvailabilityTable = pgTable(
    "scheduleAvailabilities",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        scheduleId : uuid("scheduleId")
        .notNull()
        .references(() => SceduleTable.id , {onDelete : "cascade"}),
        startTime : text("startTime").notNull(),
        endTime : text("endTime").notNull(),
        dayOfWeek : scheduleDayOfWeekEnum("dayOfWeek").notNull(),
    },
    table => ([
        index("scheduleIndex").on(table.scheduleId)
    ])
)

export const ScheduleAvailabilityRelations = relations(
    ScheduleAvailabilityTable,
    ({ one }) => ({
        schedule: one(SceduleTable , {
            fields : [ScheduleAvailabilityTable.scheduleId],
            references : [SceduleTable.id],
        })
    })
)

