-- Add onboarding completion flag to User
ALTER TABLE `User`
  ADD COLUMN `onboarding_complete` BOOLEAN NOT NULL DEFAULT false;

