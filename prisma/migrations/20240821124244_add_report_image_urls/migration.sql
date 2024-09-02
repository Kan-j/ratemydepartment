-- AlterTable
ALTER TABLE `report` ADD COLUMN `dislikesWordcloudImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `improvementsWordcloudImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `likertTargetScore` DOUBLE NULL,
    ADD COLUMN `likesWordcloudImageUrl` VARCHAR(191) NULL,
    ADD COLUMN `numberOfDepartments` INTEGER NULL,
    ADD COLUMN `numberOfRespondents` INTEGER NULL,
    ADD COLUMN `satisfactionImageUrl` VARCHAR(191) NULL;
