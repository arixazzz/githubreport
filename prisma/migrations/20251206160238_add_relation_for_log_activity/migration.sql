-- AddForeignKey
ALTER TABLE "LogActivity" ADD CONSTRAINT "LogActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
