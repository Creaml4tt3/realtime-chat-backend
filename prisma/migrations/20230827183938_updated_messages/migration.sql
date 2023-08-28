/*
  Warnings:

  - You are about to drop the column `authorEmail` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - Added the required column `author_email` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_authorEmail_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "authorEmail",
DROP COLUMN "content",
ADD COLUMN     "author_email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_author_email_fkey" FOREIGN KEY ("author_email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
