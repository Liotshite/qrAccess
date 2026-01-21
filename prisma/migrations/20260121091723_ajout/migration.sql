/*
  Warnings:

  - You are about to drop the column `name` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `projectid` on the `qrs` table. All the data in the column will be lost.
  - Added the required column `creationdate` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateevent` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventname` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventid` to the `qrs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "qrs" DROP CONSTRAINT "qrs_projectid_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "name",
ADD COLUMN     "creationdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateevent" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "qrs" DROP COLUMN "projectid",
ADD COLUMN     "eventid" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "qrs" ADD CONSTRAINT "qrs_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
