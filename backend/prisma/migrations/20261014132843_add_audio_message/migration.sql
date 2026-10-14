-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'text';
