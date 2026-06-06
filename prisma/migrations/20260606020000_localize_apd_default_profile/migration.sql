UPDATE `APDPrescription`
SET `name` = 'โปรไฟล์น้ำยาเริ่มต้น'
WHERE `name` = 'Default prescription profile';

UPDATE `APDDailyLog`
SET `drainageAppearance` = CASE `drainageAppearance`
  WHEN 'Clear' THEN 'ใส'
  WHEN 'Light yellow' THEN 'เหลืองอ่อน'
  WHEN 'Cloudy' THEN 'ขุ่น'
  WHEN 'Fibrin strands' THEN 'มีเส้นไฟบริน'
  WHEN 'Pink/blood-tinged' THEN 'ชมพู/มีเลือดปน'
  WHEN 'Other - see remark' THEN 'อื่น ๆ - ดูหมายเหตุ'
  ELSE `drainageAppearance`
END
WHERE `drainageAppearance` IN (
  'Clear',
  'Light yellow',
  'Cloudy',
  'Fibrin strands',
  'Pink/blood-tinged',
  'Other - see remark'
);

ALTER TABLE `APDPrescription`
  MODIFY `name` VARCHAR(191) NOT NULL DEFAULT 'โปรไฟล์น้ำยาเริ่มต้น';
