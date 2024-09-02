/*
  Warnings:

  - Added the required column `performanceTrendImageUrl` to the `DepartmentReport` table without a default value. This is not possible if the table is not empty.
  - Made the column `satisfactionImageUrl` on table `departmentreport` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `departmentreport` ADD COLUMN `performanceTrendImageUrl` VARCHAR(191) NOT NULL,
    MODIFY `satisfactionImageUrl` VARCHAR(191) NOT NULL;
