-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "usersQ" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
