-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "creator_id" INTEGER NOT NULL,
    CONSTRAINT "Event_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("creator_id", "date", "description", "event_id", "location", "time", "title") SELECT "creator_id", "date", "description", "event_id", "location", "time", "title" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
