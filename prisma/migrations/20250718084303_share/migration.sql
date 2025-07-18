/*
  Warnings:

  - A unique constraint covering the columns `[sharedToken]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "shareExpiry" TIMESTAMP(3),
ADD COLUMN     "sharedToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_sharedToken_key" ON "Folder"("sharedToken");
