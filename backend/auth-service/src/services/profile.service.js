import prisma from "../utils/prisma.js";

export const getProfile = async (userId) => {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
};

export const upsertProfile = async (userId, data) => {
  return prisma.userProfile.upsert({
    where: { userId },
    update: {
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      height: data.height ? Number(data.height) : undefined,
      weight: data.weight ? Number(data.weight) : undefined,
      fitPreference: data.fitPreference,
    },
    create: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      address: data.address,
      height: data.height ? Number(data.height) : null,
      weight: data.weight ? Number(data.weight) : null,
      fitPreference: data.fitPreference,
    },
  });
};
