CREATE TABLE `APDPrescription` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL DEFAULT 'Default prescription profile',
  `solutionBag1` VARCHAR(191) NOT NULL,
  `solutionBag2` VARCHAR(191) NOT NULL,
  `totalVolumeMl` INTEGER NOT NULL,
  `therapyTimeMinutes` INTEGER NOT NULL,
  `fillVolumeMl` INTEGER NOT NULL,
  `cycles` INTEGER NOT NULL,
  `dwellTimeMinutes` INTEGER NOT NULL,
  `lastFillMl` INTEGER NULL,
  `manualExchange` VARCHAR(191) NULL,
  `isDefaultProfile` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `userId` INTEGER NOT NULL,

  INDEX `APDPrescription_userId_idx`(`userId`),
  INDEX `APDPrescription_isDefaultProfile_idx`(`isDefaultProfile`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `APDDailyLog` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `treatmentStartTime` VARCHAR(191) NOT NULL,
  `weightKg` DECIMAL(5, 2) NOT NULL,
  `systolicBp` INTEGER NOT NULL,
  `diastolicBp` INTEGER NOT NULL,
  `pulse` INTEGER NOT NULL,
  `bloodGlucoseMgDl` INTEGER NULL,
  `iDrainVolumeMl` INTEGER NOT NULL,
  `totalUfMl` INTEGER NOT NULL,
  `urineAvgDayMl` INTEGER NOT NULL,
  `drainageAppearance` VARCHAR(191) NULL,
  `remark` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  `userId` INTEGER NOT NULL,
  `prescriptionId` INTEGER NULL,

  UNIQUE INDEX `APDDailyLog_userId_date_key`(`userId`, `date`),
  INDEX `APDDailyLog_userId_idx`(`userId`),
  INDEX `APDDailyLog_date_idx`(`date`),
  INDEX `APDDailyLog_prescriptionId_idx`(`prescriptionId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `APDPrescription`
  ADD CONSTRAINT `APDPrescription_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `APDDailyLog`
  ADD CONSTRAINT `APDDailyLog_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `APDDailyLog`
  ADD CONSTRAINT `APDDailyLog_prescriptionId_fkey`
  FOREIGN KEY (`prescriptionId`) REFERENCES `APDPrescription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
