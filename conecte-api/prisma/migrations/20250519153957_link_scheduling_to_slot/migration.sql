/*
  Warnings:

  - You are about to drop the column `isBooked` on the `slots` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `schedulings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedulings" ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "slots" DROP COLUMN "isBooked";
