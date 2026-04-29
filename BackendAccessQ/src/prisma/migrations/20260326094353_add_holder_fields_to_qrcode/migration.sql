-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ORG_ADMIN', 'ORG_AGENT', 'OPERATOR');

-- CreateEnum
CREATE TYPE "QrStatus" AS ENUM ('active', 'revoked', 'expired', 'used_up');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('authorized', 'denied_expired', 'denied_revoked', 'denied_limit_reached');

-- CreateTable
CREATE TABLE "usersQ" (
    "user_id" SERIAL NOT NULL,
    "clef" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),
    "org_id" INTEGER,

    CONSTRAINT "usersQ_pkey" PRIMARY KEY ("user_id")
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
    "unique_token" TEXT NOT NULL,
    "status" "QrStatus" NOT NULL,
    "usage_limit" INTEGER NOT NULL DEFAULT 1,
    "scans_count" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "level" INTEGER,
    "holder_name" TEXT,
    "holder_email" TEXT,
    "holder_phone" TEXT,

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
CREATE UNIQUE INDEX "usersQ_clef_key" ON "usersQ"("clef");

-- CreateIndex
CREATE UNIQUE INDEX "usersQ_email_key" ON "usersQ"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usersQ_verification_token_key" ON "usersQ"("verification_token");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_unique_token_key" ON "qr_codes"("unique_token");

-- AddForeignKey
ALTER TABLE "usersQ" ADD CONSTRAINT "usersQ_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("org_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_subscription_plan_fkey" FOREIGN KEY ("subscription_plan") REFERENCES "plan"("plan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_qr_code_id_fkey" FOREIGN KEY ("qr_code_id") REFERENCES "qr_codes"("qr_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_scanned_by_id_fkey" FOREIGN KEY ("scanned_by_id") REFERENCES "usersQ"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area" ADD CONSTRAINT "area_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("org_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_id_event_fkey" FOREIGN KEY ("id_event") REFERENCES "events"("event_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_id_area_fkey" FOREIGN KEY ("id_area") REFERENCES "area"("area_id") ON DELETE RESTRICT ON UPDATE CASCADE;
