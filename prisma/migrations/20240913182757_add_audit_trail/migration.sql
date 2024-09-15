/*
  Warnings:

  - You are about to drop the column `actionResult` on the `audittraillog` table. All the data in the column will be lost.
  - Added the required column `model` to the `AuditTrailLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `audittraillog` DROP COLUMN `actionResult`,
    ADD COLUMN `model` VARCHAR(191) NOT NULL,
    MODIFY `actionDetails` VARCHAR(191) NOT NULL;
