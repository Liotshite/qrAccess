/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "scan_logs" DROP CONSTRAINT "scan_logs_scanned_by_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_org_id_fkey";

-- DropTable
DROP TABLE "users";

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

-- CreateIndex
CREATE UNIQUE INDEX "usersQ_clef_key" ON "usersQ"("clef");

-- CreateIndex
CREATE UNIQUE INDEX "usersQ_email_key" ON "usersQ"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usersQ_verification_token_key" ON "usersQ"("verification_token");

-- AddForeignKey
ALTER TABLE "usersQ" ADD CONSTRAINT "usersQ_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("org_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_scanned_by_id_fkey" FOREIGN KEY ("scanned_by_id") REFERENCES "usersQ"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
