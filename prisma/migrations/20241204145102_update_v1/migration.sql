/*
  Warnings:

  - You are about to drop the column `rank` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `relationsCount` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "rank",
DROP COLUMN "relationsCount";
