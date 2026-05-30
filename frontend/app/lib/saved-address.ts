import type { AddressSelection } from '../components/AddressSelector';
import {
  buildFullAddress,
  fetchProvinces,
  fetchWardsByProvince,
} from './vietnam-address-api';

const ADDR_META_PREFIX = '[[vault-addr:v1]]';

type SavedAddressMeta = {
  provinceCode: number;
  wardCode: number;
  street: string;
  provinceName: string;
  wardName: string;
  fullAddress: string;
};

function selectionFromMeta(meta: SavedAddressMeta): AddressSelection {
  return {
    provinceCode: meta.provinceCode,
    wardCode: meta.wardCode,
    street: meta.street,
    provinceName: meta.provinceName,
    wardName: meta.wardName,
    fullAddress: meta.fullAddress,
  };
}

/** Lưu profile.address kèm mã tỉnh/phường để mở lại checkout. */
export function serializeProfileAddress(selection: AddressSelection): string {
  const fullAddress = selection.fullAddress.trim();
  if (selection.provinceCode && selection.wardCode) {
    const meta: SavedAddressMeta = {
      provinceCode: Number(selection.provinceCode),
      wardCode: Number(selection.wardCode),
      street: selection.street.trim(),
      provinceName: selection.provinceName,
      wardName: selection.wardName,
      fullAddress,
    };
    return `${ADDR_META_PREFIX}${JSON.stringify(meta)}`;
  }
  return fullAddress;
}

/** Hiển thị địa chỉ cho người dùng (bỏ metadata). */
export function formatAddressForDisplay(raw: string | null | undefined): string {
  if (!raw?.trim()) return '';
  if (raw.startsWith(ADDR_META_PREFIX)) {
    try {
      const meta = JSON.parse(raw.slice(ADDR_META_PREFIX.length)) as SavedAddressMeta;
      return meta.fullAddress || raw;
    } catch {
      return raw;
    }
  }
  return raw;
}

function parseMeta(raw: string): AddressSelection | null {
  if (!raw.startsWith(ADDR_META_PREFIX)) return null;
  try {
    const meta = JSON.parse(raw.slice(ADDR_META_PREFIX.length)) as SavedAddressMeta;
    if (!meta.provinceCode || !meta.wardCode) return null;
    return selectionFromMeta(meta);
  } catch {
    return null;
  }
}

function normalizeName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function findByName<T extends { name: string }>(
  units: T[],
  target: string
): T | undefined {
  const n = normalizeName(target);
  return units.find((u) => normalizeName(u.name) === n);
}

async function parseLegacyFullAddress(full: string): Promise<AddressSelection> {
  const segments = full.split(',').map((s) => s.trim()).filter(Boolean);

  if (segments.length < 2) {
    return {
      provinceCode: '',
      wardCode: '',
      street: full.trim(),
      provinceName: '',
      wardName: '',
      fullAddress: full.trim(),
    };
  }

  const provinceName = segments[segments.length - 1];
  const wardName = segments.length >= 3 ? segments[segments.length - 2] : '';
  const street =
    segments.length >= 3 ? segments.slice(0, -2).join(', ') : segments[0];

  const provinces = await fetchProvinces();
  const province = findByName(provinces, provinceName);

  if (!province) {
    return {
      provinceCode: '',
      wardCode: '',
      street: full.trim(),
      provinceName: '',
      wardName: '',
      fullAddress: full.trim(),
    };
  }

  let wardCode: number | '' = '';
  let wardNameResolved = '';

  if (wardName) {
    const wards = await fetchWardsByProvince(province.code);
    const ward = findByName(wards, wardName);
    if (ward) {
      wardCode = ward.code;
      wardNameResolved = ward.name;
    }
  }

  return {
    provinceCode: province.code,
    wardCode,
    street,
    provinceName: province.name,
    wardName: wardNameResolved,
    fullAddress: buildFullAddress({
      street,
      wardName: wardNameResolved || wardName,
      provinceName: province.name,
    }),
  };
}

/** Khôi phục lựa chọn tỉnh/phường từ profile.address. */
export async function resolveAddressFromSaved(
  raw: string | null | undefined
): Promise<AddressSelection | null> {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  const fromMeta = parseMeta(trimmed);
  if (fromMeta) return fromMeta;

  return parseLegacyFullAddress(trimmed);
}
