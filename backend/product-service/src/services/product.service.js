import prisma from "../utils/prisma.js";

export const createProduct = async (data) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      thumbnail: data.thumbnail,

      variants: {
        create: data.variants,
      },
    },

    include: {
      variants: true,
    },
  });
};

export const getAllProducts = async () => {
  return prisma.product.findMany({
    include: {
      variants: true,
      reviews: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      variants: true,
      reviews: true,
    },
  });
};

export const updateProduct = async (
  id,
  data
) => {
  return prisma.product.update({
    where: {
      id: Number(id),
    },

    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      thumbnail: data.thumbnail,
    },
  });
};

export const deleteProduct = async (id) => {
  return prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
};

export const decrementStockBatch = async (items) => {
  return prisma.$transaction(async (tx) => {
    const updated = [];

    for (const item of items) {
      const variant = await tx.productVariant.findUnique({
        where: { id: Number(item.variantId) },
        include: { product: true },
      });

      if (!variant) {
        throw new Error(`Variant ${item.variantId} not found`);
      }

      if (variant.stock < item.quantity) {
        throw new Error(
          `Không đủ tồn kho: ${variant.product.name} (size ${variant.size}) chỉ còn ${variant.stock}`
        );
      }

      const result = await tx.productVariant.update({
        where: { id: variant.id },
        data: {
          stock: {
            decrement: Number(item.quantity),
          },
        },
      });

      updated.push(result);
    }

    return updated;
  });
};

export const restoreStockBatch = async (items) => {
  return prisma.$transaction(
    items.map((item) =>
      prisma.productVariant.update({
        where: { id: Number(item.variantId) },
        data: {
          stock: {
            increment: Number(item.quantity),
          },
        },
      })
    )
  );
};

export const updateProductVariants = async (productId, variants) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(productId) },
    include: { variants: true },
  });

  if (!product) {
    throw new Error("Không tìm thấy sản phẩm");
  }

  return prisma.$transaction(async (tx) => {
    const updated = [];

    for (const item of variants) {
      if (item.id) {
        const existing = product.variants.find((v) => v.id === Number(item.id));
        if (!existing) {
          throw new Error(`Biến thể #${item.id} không thuộc sản phẩm này`);
        }
        const row = await tx.productVariant.update({
          where: { id: Number(item.id) },
          data: {
            stock: Math.max(0, Number(item.stock) || 0),
            ...(item.size ? { size: String(item.size).trim() } : {}),
          },
        });
        updated.push(row);
      } else if (item.size) {
        const size = String(item.size).trim();
        const duplicate = product.variants.some(
          (v) => v.size.toLowerCase() === size.toLowerCase()
        );
        if (duplicate) {
          throw new Error(`Size "${size}" đã tồn tại`);
        }
        const row = await tx.productVariant.create({
          data: {
            productId: Number(productId),
            size,
            stock: Math.max(0, Number(item.stock) || 0),
          },
        });
        updated.push(row);
      }
    }

    return tx.product.findUnique({
      where: { id: Number(productId) },
      include: { variants: true },
    });
  });
};