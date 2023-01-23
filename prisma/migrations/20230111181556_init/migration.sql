-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(20) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(100) NULL,
    `passwordHash` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `User_userName_key`(`userName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
