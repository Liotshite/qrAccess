/*
  Warnings:

  - You are about to drop the column `catId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionPlan` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `qr_codes` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `qr_codes` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `qr_codes` table. All the data in the column will be lost.
  - You are about to drop the column `scansCount` on the `qr_codes` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueToken` on the `qr_codes` table. All the data in the column will be lost.
  - You are about to drop the column `usageLimit` on the `qr_codes` table. All the data in the column will be lost.
  - You are about to drop the column `validFrom` on the `qr_codes` table. All the data in the column will be lost.
  - You are about to drop the column `validUntil` on the `qr_codes` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `scan_logs` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `scan_logs` table. All the data in the column will be lost.
  - You are about to drop the column `operatorId` on the `scan_logs` table. All the data in the column will be lost.
  - You are about to drop the column `qrId` on the `scan_logs` table. All the data in the column will be lost.
  - You are about to drop the column `scannedAt` on the `scan_logs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[unique_token]` on the table `qr_codes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `qr_codes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unique_token` to the `qr_codes` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `qr_codes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `qr_code_id` to the `scan_logs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `scan_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN', 'ORG_AGENT', 'OPERATOR');

-- CreateEnum
CREATE TYPE "QrStatus" AS ENUM ('active', 'revoked', 'expired', 'used_up');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('authorized', 'denied_expired', 'denied_revoked', 'denied_limit_reached');

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_userId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_catId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_userId_fkey";

-- DropForeignKey
ALTER TABLE "qr_codes" DROP CONSTRAINT "qr_codes_eventId_fkey";

-- DropForeignKey
ALTER TABLE "scan_logs" DROP CONSTRAINT "scan_logs_operatorId_fkey";

-- DropForeignKey
ALTER TABLE "scan_logs" DROP CONSTRAINT "scan_logs_qrId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_orgId_fkey";

-- DropIndex
DROP INDEX "qr_codes_uniqueToken_key";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "catId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "userId",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "user_id" INTEGER NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "createdAt",
DROP COLUMN "subscriptionPlan",
ADD COLUMN     "created_at" TIMESTAMP(3),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "subscription_plan" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "qr_codes" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "eventId",
DROP COLUMN "scansCount",
DROP COLUMN "uniqueToken",
DROP COLUMN "usageLimit",
DROP COLUMN "validFrom",
DROP COLUMN "validUntil",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "event_id" INTEGER NOT NULL,
ADD COLUMN     "scans_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unique_token" TEXT NOT NULL,
ADD COLUMN     "usage_limit" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "valid_from" TIMESTAMP(3),
ADD COLUMN     "valid_until" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "QrStatus" NOT NULL;

-- AlterTable
ALTER TABLE "scan_logs" DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "operatorId",
DROP COLUMN "qrId",
DROP COLUMN "scannedAt",
ADD COLUMN     "location_lat" DOUBLE PRECISION,
ADD COLUMN     "location_long" DOUBLE PRECISION,
ADD COLUMN     "qr_code_id" INTEGER NOT NULL,
ADD COLUMN     "scanned_at" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "ScanStatus" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "fullName",
DROP COLUMN "orgId",
DROP COLUMN "passwordHash",
ADD COLUMN     "created_at" TIMESTAMP(3),
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "org_id" INTEGER,
ADD COLUMN     "password_hash" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- DropTable
DROP TABLE "categories";

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "catTitle" TEXT,
    "userId" INTEGER,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_unique_token_key" ON "qr_codes"("unique_token");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
