-- AlterTable
ALTER TABLE "Review" ADD COLUMN "orderId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Review_orderId_key" ON "Review"("orderId");
