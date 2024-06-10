-- CreateTable
CREATE TABLE `DepartmentRanking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `departmentId` INTEGER NOT NULL,
    `averageRating` DOUBLE NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `year` INTEGER NOT NULL,
    `quarter` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DepartmentRanking` ADD CONSTRAINT `DepartmentRanking_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
