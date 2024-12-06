/*
  Warnings:

  - You are about to drop the column `relatedWordId` on the `Relation` table. All the data in the column will be lost.
  - You are about to drop the column `wordId` on the `Relation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wordFromId,wordToId,relationType]` on the table `Relation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `wordFromId` to the `Relation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wordToId` to the `Relation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_relatedWordId_fkey";

-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_wordId_fkey";

-- DropIndex
DROP INDEX "Relation_wordId_relatedWordId_key";

-- AlterTable
ALTER TABLE "Relation" DROP COLUMN "relatedWordId",
DROP COLUMN "wordId",
ADD COLUMN     "wordFromId" INTEGER NOT NULL,
ADD COLUMN     "wordToId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Relation_wordFromId_wordToId_relationType_key" ON "Relation"("wordFromId", "wordToId", "relationType");

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_wordFromId_fkey" FOREIGN KEY ("wordFromId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_wordToId_fkey" FOREIGN KEY ("wordToId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
