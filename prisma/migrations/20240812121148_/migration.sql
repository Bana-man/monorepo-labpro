/*
  Warnings:

  - You are about to drop the column `cover_image` on the `Film` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Film` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Film` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `balance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `video_url` to the `Film` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Film" DROP COLUMN "cover_image",
DROP COLUMN "video",
ADD COLUMN     "cover_image_url" TEXT,
ADD COLUMN     "video_url" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE INTEGER;
