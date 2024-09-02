/*
  Warnings:

  - You are about to drop the `report` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `report` DROP FOREIGN KEY `Report_departmentId_fkey`;

-- DropTable
DROP TABLE `report`;

-- CreateTable
CREATE TABLE `CorporateReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `quarter` INTEGER NOT NULL,
    `keyObservations` VARCHAR(191) NOT NULL,
    `keyRecommendations` VARCHAR(191) NOT NULL,
    `satisfactionImageUrl` VARCHAR(191) NULL,
    `likesWordcloudImageUrl` VARCHAR(191) NULL,
    `dislikesWordcloudImageUrl` VARCHAR(191) NULL,
    `improvementsWordcloudImageUrl` VARCHAR(191) NULL,
    `numberOfDepartments` INTEGER NULL,
    `numberOfRespondents` INTEGER NULL,
    `likertTargetScore` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DepartmentReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `departmentId` INTEGER NULL,
    `year` INTEGER NOT NULL,
    `quarter` INTEGER NOT NULL,
    `satisfactionImageUrl` VARCHAR(191) NULL,
    `likertTargetScore` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DepartmentReport` ADD CONSTRAINT `DepartmentReport_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
