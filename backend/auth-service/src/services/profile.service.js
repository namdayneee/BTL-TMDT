import prisma from "../utils/prisma.js";

export const getProfile = async (userId) => {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
};

function buildProfileFields(data) {
  const fields = {};
  if (data.fullName !== undefined) {
    fields.fullName = data.fullName === null ? null : String(data.fullName).trim() || null;
  }
  if (data.phone !== undefined) {
    fields.phone = data.phone === null ? null : String(data.phone).trim() || null;
  }
  if (data.address !== undefined) {
    fields.address = data.address === null ? null : String(data.address).trim() || null;
  }
  if (data.height !== undefined) {
    fields.height =
      data.height === null || data.height === ""
        ? null
        : Number(data.height);
  }
  if (data.weight !== undefined) {
    fields.weight =
      data.weight === null || data.weight === ""
        ? null
        : Number(data.weight);
  }
  if (data.fitPreference !== undefined) {
    fields.fitPreference = data.fitPreference || null;
  }
  return fields;
}

export const upsertProfile = async (userId, data) => {
  const fields = buildProfileFields(data);
  const existing = await prisma.userProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    return prisma.userProfile.create({
      data: {
        userId,
        fullName: fields.fullName ?? null,
        phone: fields.phone ?? null,
        address: fields.address ?? null,
        height: fields.height ?? null,
        weight: fields.weight ?? null,
        fitPreference: fields.fitPreference ?? null,
      },
    });
  }

  if (Object.keys(fields).length === 0) {
    return existing;
  }

  return prisma.userProfile.update({
    where: { userId },
    data: fields,
  });
};
