/*
  Warnings:

  - You are about to drop the column `dateTime` on the `schedulings` table. All the data in the column will be lost.
  - Added the required column `slotId` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedulings" DROP COLUMN "dateTime",
ADD COLUMN     "slotId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "schedulings" ADD CONSTRAINT "schedulings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
