/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Roles` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `objectId` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,action,guildId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PenaltyType" AS ENUM ('BAN', 'TIMEOUT', 'WARN');

-- DropIndex
DROP INDEX "Event_guildId_title_key";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "Roles",
DROP COLUMN "objectId",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "metadata" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "Queue" (
    "title" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "Tracks" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Member" (
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "guildId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Penalty" (
    "userId" TEXT NOT NULL,
    "type" "PenaltyType" NOT NULL,
    "reason" TEXT,
    "expires" TIMESTAMP(3),
    "guildId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Queue_title_guildId_key" ON "Queue"("title", "guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_guildId_key" ON "Member"("userId", "guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Penalty_type_userId_guildId_key" ON "Penalty"("type", "userId", "guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_title_action_guildId_key" ON "Event"("title", "action", "guildId");

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_userId_guildId_fkey" FOREIGN KEY ("userId", "guildId") REFERENCES "Member"("userId", "guildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_userId_guildId_fkey" FOREIGN KEY ("userId", "guildId") REFERENCES "Member"("userId", "guildId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
