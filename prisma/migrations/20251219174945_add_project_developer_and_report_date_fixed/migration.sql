/*
  Warnings:

  - A unique constraint covering the columns `[projectId,userId,commitDate]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Report_projectId_userId_commitRange_key";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "commitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ProjectDeveloper" (
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ProjectDeveloper_pkey" PRIMARY KEY ("projectId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_projectId_userId_commitDate_key" ON "Report"("projectId", "userId", "commitDate");

-- AddForeignKey
ALTER TABLE "ProjectDeveloper" ADD CONSTRAINT "ProjectDeveloper_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectDeveloper" ADD CONSTRAINT "ProjectDeveloper_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
