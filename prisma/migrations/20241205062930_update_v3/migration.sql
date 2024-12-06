/*
  Warnings:

  - You are about to drop the `Relation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_wordFromId_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_wordToId_fkey";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "antonyms" INTEGER[],
ADD COLUMN     "similar" INTEGER[],
ADD COLUMN     "synonyms" INTEGER[];

-- DropTable
DROP TABLE "Relation";

-- DropEnum
DROP TYPE "RelationType";
