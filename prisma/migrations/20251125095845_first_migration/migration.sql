-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "stack" TEXT NOT NULL,
    "linkgithub" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "developer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "usernamegithub" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logActivity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "activity" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_detail_key" ON "Project"("detail");

-- CreateIndex
CREATE UNIQUE INDEX "Project_linkgithub_key" ON "Project"("linkgithub");

-- CreateIndex
CREATE UNIQUE INDEX "user_usernamegithub_key" ON "user"("usernamegithub");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
