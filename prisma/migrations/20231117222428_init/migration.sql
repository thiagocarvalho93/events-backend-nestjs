-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Event" (
    "event_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" DATETIME NOT NULL,
    "creator_id" INTEGER NOT NULL,
    CONSTRAINT "Event_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    CONSTRAINT "UserEvent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserEvent_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "comment_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "user_event_id" INTEGER,
    CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event" ("event_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_user_event_id_fkey" FOREIGN KEY ("user_event_id") REFERENCES "UserEvent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
