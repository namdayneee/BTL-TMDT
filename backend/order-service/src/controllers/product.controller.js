export const getVariantById = async (
  req,
  res
) => {
  try {
    const variant =
      await prisma.productVariant.findUnique({
        where: {
          id: Number(req.params.id),
        },

        include: {
          product: true,
        },
      });

    res.json(variant);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};