import provincesV2Data from '../data/provinces-v2.json';

/** Sau sáp nhập 07/2025: 34 tỉnh/thành, phường/xã trực thuộc (không còn quận/huyện). */
export const VN_PROVINCE_COUNT = 34;
const WARDS_API_BASE = 'https://provinces.open-api.vn/api/v2';

export type AdminUnit = {
  name: string;
  code: number;
  division_type?: string;
  codename?: string;
  phone_code?: number;
};

export type Province = AdminUnit & {
  wards?: Ward[];
};

export type Ward = AdminUnit & {
  province_code?: number;
};

const provincesSorted: Province[] = [...provincesV2Data].sort((a, b) =>
  a.name.localeCompare(b.name, 'vi')
);

if (provincesSorted.length !== VN_PROVINCE_COUNT) {
  console.warn(
    `[vietnam-address] provinces-v2.json có ${provincesSorted.length} tỉnh, kỳ vọng ${VN_PROVINCE_COUNT}`
  );
}

async function fetchWardsJson<T>(path: string): Promise<T> {
  const res = await fetch(`${WARDS_API_BASE}${path}`);
  if (!res.ok) {
    throw new Error('Không tải được danh sách phường/xã');
  }
  return res.json() as Promise<T>;
}

/** 34 tỉnh/thành sau sáp nhập — dữ liệu cố định, không gọi API v1 (63 tỉnh cũ). */
export async function fetchProvinces(): Promise<Province[]> {
  return provincesSorted;
}

/** Phường/xã trực thuộc tỉnh (API v2). */
export async function fetchWardsByProvince(provinceCode: number): Promise<Ward[]> {
  const data = await fetchWardsJson<Province>(`/p/${provinceCode}?depth=2`);
  const wards = data.wards ?? [];
  return wards.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

export function buildFullAddress(parts: {
  street: string;
  wardName?: string;
  provinceName?: string;
}): string {
  const segments = [parts.street.trim(), parts.wardName, parts.provinceName].filter(Boolean);
  return segments.join(', ');
}
