/*
  Warnings:

  - You are about to alter the column `actionDetails` on the `audittraillog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `audittraillog` MODIFY `actionDetails` JSON NOT NULL;
