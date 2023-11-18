/*
  Warnings:

  - You are about to drop the column `time` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,event_id]` on the table `UserEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator_id" INTEGER NOT NULL,
    CONSTRAINT "Event_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("creator_id", "date", "description", "event_id", "location", "title") SELECT "creator_id", "date", "description", "event_id", "location", "title" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserEvent_user_id_event_id_key" ON "UserEvent"("user_id", "event_id");
