/*
  Warnings:

  - Changed the type of `upload_speed` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `download_speed` on the `Application` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "upload_speed",
ADD COLUMN     "upload_speed" DOUBLE PRECISION NOT NULL,
DROP COLUMN "download_speed",
ADD COLUMN     "download_speed" DOUBLE PRECISION NOT NULL;
