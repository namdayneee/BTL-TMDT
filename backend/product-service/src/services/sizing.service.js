import prisma from "../utils/prisma.js";

const TOLERANCE_HEIGHT = 2;
const TOLERANCE_WEIGHT = 2;
const MIN_SAMPLES = 3;

/**
 * Collaborative Filtering: tìm nhóm user tương đồng ±2cm/±2kg
 * → phân tích size họ đã chọn và fitFeeling → trả gợi ý xác suất
 */
export const recommendSize = async (height, weight, fitPreference = null, productId = null) => {
  const whereClause = {
    height: { gte: height - TOLERANCE_HEIGHT, lte: height + TOLERANCE_HEIGHT },
    weight: { gte: weight - TOLERANCE_WEIGHT, lte: weight + TOLERANCE_WEIGHT },
    purchasedSize: { not: null },
    fitFeeling: { not: null },
  };

  if (productId) {
    whereClause.productId = Number(productId);
  }

  // Tìm reviews của nhóm người tương đồng
  const similarReviews = await prisma.review.findMany({
    where: whereClause,
    select: {
      purchasedSize: true,
      fitFeeling: true,
    },
  });

  // Nếu đủ dữ liệu collaborative filtering
  if (similarReviews.length >= MIN_SAMPLES) {
    // Lọc theo fitPreference nếu có
    let filtered = similarReviews;
    if (fitPreference) {
      const preferenceMap = {
        snug: ["tight", "true_to_size"],
        regular: ["true_to_size"],
        loose: ["loose", "true_to_size"],
      };
      const wanted = preferenceMap[fitPreference] || ["true_to_size"];
      const preferredReviews = similarReviews.filter((r) => wanted.includes(r.fitFeeling));
      if (preferredReviews.length >= MIN_SAMPLES) {
        filtered = preferredReviews;
      }
    }

    // Đếm số lần chọn mỗi size
    const sizeCounts = {};
    for (const r of filtered) {
      const s = r.purchasedSize;
      sizeCounts[s] = (sizeCounts[s] || 0) + 1;
    }

    const total = filtered.length;
    const distribution = {};
    for (const [size, count] of Object.entries(sizeCounts)) {
      distribution[size] = Math.round((count / total) * 100) / 100;
    }

    // Size có xác suất cao nhất
    const recommendedSize = Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0][0];
    const confidence = distribution[recommendedSize];
    const pct = Math.round(confidence * 100);

    return {
      method: "collaborative",
      recommendedSize,
      confidence,
      distribution,
      sampleCount: filtered.length,
      message: `${pct}% khách có vóc dáng tương đồng với bạn đã chọn size ${recommendedSize} và cảm thấy phù hợp`,
    };
  }

  // Fallback: dùng SizingRule tĩnh
  const rule = await prisma.sizingRule.findFirst({
    where: {
      minHeight: { lte: height },
      maxHeight: { gte: height },
      minWeight: { lte: weight },
      maxWeight: { gte: weight },
    },
  });

  if (rule) {
    return {
      method: "rule_based",
      recommendedSize: rule.size,
      confidence: null,
      distribution: null,
      sampleCount: similarReviews.length,
      message: `Dựa trên bảng size chuẩn, chúng tôi gợi ý size ${rule.size} cho bạn`,
    };
  }

  return {
    method: "none",
    recommendedSize: null,
    confidence: null,
    distribution: null,
    sampleCount: 0,
    message: "Chưa đủ dữ liệu để gợi ý. Vui lòng tham khảo bảng size trên trang sản phẩm.",
  };
};

export const createSizingRule = async (data) => {
  return prisma.sizingRule.create({ data });
};

export const getAllSizingRules = async () => {
  return prisma.sizingRule.findMany({ orderBy: { minHeight: "asc" } });
};
