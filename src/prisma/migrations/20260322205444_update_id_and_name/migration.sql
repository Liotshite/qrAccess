/*
  Warnings:

  - You are about to drop the `Area` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Deroulement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QrCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScanLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN', 'ORG_AGENT', 'OPERATOR');

-- DropForeignKey
ALTER TABLE "Deroulement" DROP CONSTRAINT "Deroulement_id_area_fkey";

-- DropForeignKey
ALTER TABLE "Deroulement" DROP CONSTRAINT "Deroulement_id_event_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_org_id_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_subscription_plan_fkey";

-- DropForeignKey
ALTER TABLE "QrCode" DROP CONSTRAINT "QrCode_event_id_fkey";

-- DropForeignKey
ALTER TABLE "ScanLog" DROP CONSTRAINT "ScanLog_qr_code_id_fkey";

-- DropForeignKey
ALTER TABLE "ScanLog" DROP CONSTRAINT "ScanLog_scanned_by_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_org_id_fkey";

-- DropTable
DROP TABLE "Area";

-- DropTable
DROP TABLE "Deroulement";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "Plan";

-- DropTable
DROP TABLE "QrCode";

-- DropTable
DROP TABLE "ScanLog";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "clef" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),
    "org_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "org_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "subscription_plan" INTEGER,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("org_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "qr_id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "information" TEXT,
    "unique_token" TEXT NOT NULL,
    "status" "QrStatus" NOT NULL,
    "usage_limit" INTEGER NOT NULL DEFAULT 1,
    "scans_count" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "level" INTEGER,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("qr_id")
);

-- CreateTable
CREATE TABLE "scan_logs" (
    "id" SERIAL NOT NULL,
    "qr_code_id" INTEGER NOT NULL,
    "scanned_by_id" INTEGER NOT NULL,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location_lat" DECIMAL(65,30),
    "location_long" DECIMAL(65,30),
    "status" "ScanStatus" NOT NULL,

    CONSTRAINT "scan_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area" (
    "area_id" SERIAL NOT NULL,
    "org_id" INTEGER NOT NULL,
    "area_name" TEXT NOT NULL,
    "accreditation_level" INTEGER NOT NULL,

    CONSTRAINT "area_pkey" PRIMARY KEY ("area_id")
);

-- CreateTable
CREATE TABLE "plan" (
    "plan_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "features" JSONB NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("plan_id")
);

-- CreateTable
CREATE TABLE "EventSchedule" (
    "id" SERIAL NOT NULL,
    "id_event" INTEGER NOT NULL,
    "id_area" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clef_key" ON "users"("clef");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_unique_token_key" ON "qr_codes"("unique_token");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("org_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_subscription_plan_fkey" FOREIGN KEY ("subscription_plan") REFERENCES "plan"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("qr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_scanned_by_id_fkey" FOREIGN KEY ("scanned_by_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area" ADD CONSTRAINT "area_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "area"("area_id") ON DELETE RESTRICT ON UPDATE CASCADE;
