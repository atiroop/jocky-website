UPDATE `APDPrescription`
SET `lastFillMl` = 0
WHERE `lastFillMl` IS NULL;

ALTER TABLE `APDPrescription`
  MODIFY `lastFillMl` INTEGER NULL DEFAULT 0;
