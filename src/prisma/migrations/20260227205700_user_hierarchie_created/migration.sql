/*
  Warnings:

  - A unique constraint covering the columns `[clef]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `clef` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "clef" TEXT NOT NULL,
ADD COLUMN     "created_by_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_clef_key" ON "users"("clef");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
