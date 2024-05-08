-- AlterTable
ALTER TABLE `rating` ADD COLUMN `isPublished` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false;
