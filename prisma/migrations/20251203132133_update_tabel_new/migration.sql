/*
  Warnings:

  - You are about to drop the `logActivity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "logActivity";

-- CreateTable
CREATE TABLE "LogActivity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogActivity_pkey" PRIMARY KEY ("id")
);
