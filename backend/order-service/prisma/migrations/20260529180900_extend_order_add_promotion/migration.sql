-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "promoCode" TEXT,
ADD COLUMN     "shippingAddress" TEXT,
ADD COLUMN     "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shippingName" TEXT,
ADD COLUMN     "shippingPhone" TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "minOrderValue" DOUBLE PRECISION,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_code_key" ON "Promotion"("code");
