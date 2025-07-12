/*
  Warnings:

  - A unique constraint covering the columns `[phone_num]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_phone_num_key" ON "User"("phone_num");
