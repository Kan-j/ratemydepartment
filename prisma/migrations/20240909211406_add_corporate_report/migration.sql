/*
  Warnings:

  - You are about to drop the column `dislikesWordcloudImageUrl` on the `corporatereport` table. All the data in the column will be lost.
  - You are about to drop the column `improvementsWordcloudImageUrl` on the `corporatereport` table. All the data in the column will be lost.
  - You are about to drop the column `keyObservations` on the `corporatereport` table. All the data in the column will be lost.
  - You are about to drop the column `keyRecommendations` on the `corporatereport` table. All the data in the column will be lost.
  - You are about to drop the column `likertTargetScore` on the `corporatereport` table. All the data in the column will be lost.
  - You are about to drop the column `likesWordcloudImageUrl` on the `corporatereport` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfDepartments` on the `corporatereport` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfRespondents` on the `corporatereport` table. All the data in the column will be lost.
  - You are about to drop the column `satisfactionImageUrl` on the `corporatereport` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `CorporateReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `corporatereport` DROP COLUMN `dislikesWordcloudImageUrl`,
    DROP COLUMN `improvementsWordcloudImageUrl`,
    DROP COLUMN `keyObservations`,
    DROP COLUMN `keyRecommendations`,
    DROP COLUMN `likertTargetScore`,
    DROP COLUMN `likesWordcloudImageUrl`,
    DROP COLUMN `numberOfDepartments`,
    DROP COLUMN `numberOfRespondents`,
    DROP COLUMN `satisfactionImageUrl`,
    ADD COLUMN `fileUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `year` VARCHAR(191) NOT NULL,
    MODIFY `quarter` VARCHAR(191) NOT NULL;
