/**
 * Seed promotions
 * Chạy: node src/seed/seed-promotions.js
 */
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const promotions = [
  {
    code: "VAULT10",
    discountType: "percent",
    discountValue: 10,
    minOrderValue: 200000,
    isActive: true,
  },
  {
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 30000,
    minOrderValue: 0,
    isActive: true,
  },
  {
    code: "WELCOME50K",
    discountType: "fixed",
    discountValue: 50000,
    minOrderValue: 300000,
    isActive: true,
  },
  {
    code: "VAULT20",
    discountType: "percent",
    discountValue: 20,
    minOrderValue: 500000,
    isActive: true,
  },
  {
    code: "EARLYMEMBER",
    discountType: "percent",
    discountValue: 15,
    minOrderValue: 0,
    isActive: true,
  },
];

async function seed() {
  console.log("🌱 Seeding promotions...");
  for (const p of promotions) {
    await prisma.promotion.upsert({
      where: { code: p.code },
      update: p,
      create: p,
    });
  }
  console.log(`✅ Upserted ${promotions.length} promotions`);
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
