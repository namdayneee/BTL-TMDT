/**
 * Seed data cho Smart Sizing (Collaborative Filtering)
 * Chạy: node src/seed/seed-sizing.js
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Quy tắc size cơ bản (fallback)
const sizingRules = [
  { minHeight: 150, maxHeight: 160, minWeight: 40, maxWeight: 55, size: "S" },
  { minHeight: 155, maxHeight: 165, minWeight: 50, maxWeight: 65, size: "M" },
  { minHeight: 160, maxHeight: 172, minWeight: 55, maxWeight: 70, size: "M" },
  { minHeight: 165, maxHeight: 175, minWeight: 60, maxWeight: 75, size: "L" },
  { minHeight: 170, maxHeight: 180, minWeight: 65, maxWeight: 80, size: "L" },
  { minHeight: 175, maxHeight: 185, minWeight: 72, maxWeight: 90, size: "XL" },
  { minHeight: 180, maxHeight: 195, minWeight: 80, maxWeight: 100, size: "XL" },
];

// Dataset review giả lập cho collaborative filtering
// height (cm), weight (kg), fitFeeling, purchasedSize
const reviewData = [
  // --- Size S nhóm ---
  { userId: 1, height: 155, weight: 47, fitFeeling: "true_to_size", purchasedSize: "S" },
  { userId: 2, height: 157, weight: 50, fitFeeling: "true_to_size", purchasedSize: "S" },
  { userId: 3, height: 154, weight: 45, fitFeeling: "loose", purchasedSize: "S" },
  { userId: 4, height: 158, weight: 52, fitFeeling: "true_to_size", purchasedSize: "S" },
  { userId: 5, height: 156, weight: 48, fitFeeling: "true_to_size", purchasedSize: "S" },
  { userId: 6, height: 153, weight: 46, fitFeeling: "loose", purchasedSize: "XS" },
  { userId: 7, height: 159, weight: 53, fitFeeling: "tight", purchasedSize: "M" },

  // --- Size M nhóm ---
  { userId: 8, height: 162, weight: 57, fitFeeling: "true_to_size", purchasedSize: "M" },
  { userId: 9, height: 165, weight: 60, fitFeeling: "true_to_size", purchasedSize: "M" },
  { userId: 10, height: 163, weight: 58, fitFeeling: "true_to_size", purchasedSize: "M" },
  { userId: 11, height: 164, weight: 62, fitFeeling: "loose", purchasedSize: "M" },
  { userId: 12, height: 161, weight: 56, fitFeeling: "true_to_size", purchasedSize: "M" },
  { userId: 13, height: 166, weight: 63, fitFeeling: "true_to_size", purchasedSize: "M" },
  { userId: 14, height: 160, weight: 57, fitFeeling: "tight", purchasedSize: "L" },
  { userId: 15, height: 164, weight: 59, fitFeeling: "true_to_size", purchasedSize: "M" },
  { userId: 16, height: 162, weight: 58, fitFeeling: "loose", purchasedSize: "M" },
  { userId: 17, height: 167, weight: 64, fitFeeling: "true_to_size", purchasedSize: "M" },

  // --- Size L nhóm ---
  { userId: 18, height: 170, weight: 67, fitFeeling: "true_to_size", purchasedSize: "L" },
  { userId: 19, height: 172, weight: 70, fitFeeling: "true_to_size", purchasedSize: "L" },
  { userId: 20, height: 168, weight: 65, fitFeeling: "true_to_size", purchasedSize: "L" },
  { userId: 21, height: 171, weight: 69, fitFeeling: "true_to_size", purchasedSize: "L" },
  { userId: 22, height: 173, weight: 72, fitFeeling: "loose", purchasedSize: "L" },
  { userId: 23, height: 169, weight: 66, fitFeeling: "true_to_size", purchasedSize: "L" },
  { userId: 24, height: 170, weight: 68, fitFeeling: "tight", purchasedSize: "XL" },
  { userId: 25, height: 172, weight: 71, fitFeeling: "true_to_size", purchasedSize: "L" },
  { userId: 26, height: 168, weight: 64, fitFeeling: "loose", purchasedSize: "L" },
  { userId: 27, height: 174, weight: 73, fitFeeling: "true_to_size", purchasedSize: "L" },
  { userId: 28, height: 170, weight: 67, fitFeeling: "true_to_size", purchasedSize: "L" },
  { userId: 29, height: 171, weight: 68, fitFeeling: "true_to_size", purchasedSize: "L" },

  // --- Size XL nhóm ---
  { userId: 30, height: 176, weight: 77, fitFeeling: "true_to_size", purchasedSize: "XL" },
  { userId: 31, height: 178, weight: 80, fitFeeling: "true_to_size", purchasedSize: "XL" },
  { userId: 32, height: 175, weight: 75, fitFeeling: "true_to_size", purchasedSize: "XL" },
  { userId: 33, height: 179, weight: 82, fitFeeling: "loose", purchasedSize: "XL" },
  { userId: 34, height: 177, weight: 78, fitFeeling: "true_to_size", purchasedSize: "XL" },
  { userId: 35, height: 180, weight: 83, fitFeeling: "true_to_size", purchasedSize: "XL" },
  { userId: 36, height: 176, weight: 76, fitFeeling: "tight", purchasedSize: "XXL" },
  { userId: 37, height: 178, weight: 79, fitFeeling: "true_to_size", purchasedSize: "XL" },
  { userId: 38, height: 175, weight: 74, fitFeeling: "loose", purchasedSize: "XL" },
  { userId: 39, height: 177, weight: 80, fitFeeling: "true_to_size", purchasedSize: "XL" },

  // --- Size XXL nhóm ---
  { userId: 40, height: 182, weight: 87, fitFeeling: "true_to_size", purchasedSize: "XXL" },
  { userId: 41, height: 184, weight: 90, fitFeeling: "true_to_size", purchasedSize: "XXL" },
  { userId: 42, height: 181, weight: 85, fitFeeling: "true_to_size", purchasedSize: "XXL" },
  { userId: 43, height: 185, weight: 93, fitFeeling: "loose", purchasedSize: "XXL" },
  { userId: 44, height: 183, weight: 88, fitFeeling: "true_to_size", purchasedSize: "XXL" },
  { userId: 45, height: 180, weight: 84, fitFeeling: "tight", purchasedSize: "XXL" },
];

async function seed() {
  console.log("🌱 Seeding sizing rules...");

  // Clear existing rules
  await prisma.sizingRule.deleteMany();

  for (const rule of sizingRules) {
    await prisma.sizingRule.create({ data: rule });
  }
  console.log(`✅ Created ${sizingRules.length} sizing rules`);

  // Get first product for reviews
  const product = await prisma.product.findFirst();
  if (!product) {
    console.log("⚠️  Không tìm thấy sản phẩm nào. Hãy tạo sản phẩm trước khi seed reviews.");
    await prisma.$disconnect();
    return;
  }

  console.log(`🌱 Seeding reviews for product: ${product.name} (id: ${product.id})...`);

  // Xóa reviews cũ của sản phẩm này (chỉ những review có purchasedSize để không mất review thật)
  await prisma.review.deleteMany({
    where: {
      productId: product.id,
      purchasedSize: { not: null },
      height: { not: null },
    },
  });

  for (const r of reviewData) {
    await prisma.review.create({
      data: {
        userId: r.userId,
        productId: product.id,
        rating: 4,
        content: `Review seed - size ${r.purchasedSize}, cảm giác: ${r.fitFeeling}`,
        height: r.height,
        weight: r.weight,
        fitFeeling: r.fitFeeling,
        purchasedSize: r.purchasedSize,
      },
    });
  }

  console.log(`✅ Created ${reviewData.length} sizing reviews`);
  console.log("\n🎉 Seed hoàn tất! Smart Sizing có dữ liệu để hoạt động.");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
