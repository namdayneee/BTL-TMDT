'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  buildFullAddress,
  fetchProvinces,
  fetchWardsByProvince,
  VN_PROVINCE_COUNT,
  type Province,
  type Ward,
} from '../lib/vietnam-address-api';

export type AddressSelection = {
  provinceCode: number | '';
  wardCode: number | '';
  street: string;
  provinceName: string;
  wardName: string;
  fullAddress: string;
};

type AddressSelectorProps = {
  value: AddressSelection;
  onChange: (next: AddressSelection) => void;
  disabled?: boolean;
};

const emptySelection = (): AddressSelection => ({
  provinceCode: '',
  wardCode: '',
  street: '',
  provinceName: '',
  wardName: '',
  fullAddress: '',
});

function withFullAddress(
  base: Omit<AddressSelection, 'fullAddress'>,
  street?: string
): AddressSelection {
  const s = street ?? base.street;
  return {
    ...base,
    street: s,
    fullAddress: buildFullAddress({
      street: s,
      wardName: base.wardName,
      provinceName: base.provinceName,
    }),
  };
}

const selectClass =
  'w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm outline-none focus:border-secondary transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

export default function AddressSelector({ value, onChange, disabled }: AddressSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    void fetchProvinces()
      .then(setProvinces)
      .catch(() => setLoadError('Không tải được danh sách tỉnh/thành'))
      .finally(() => setLoadingProvinces(false));
  }, []);

  useEffect(() => {
    if (!value.provinceCode) {
      setWards([]);
      return;
    }

    setLoadingWards(true);
    void fetchWardsByProvince(Number(value.provinceCode))
      .then(setWards)
      .catch(() => setLoadError('Không tải được phường/xã'))
      .finally(() => setLoadingWards(false));
  }, [value.provinceCode]);

  const handleProvinceChange = (code: string) => {
    if (!code) {
      onChange(emptySelection());
      return;
    }
    const province = provinces.find((p) => p.code === Number(code));
    onChange(
      withFullAddress({
        provinceCode: Number(code),
        wardCode: '',
        street: value.street,
        provinceName: province?.name ?? '',
        wardName: '',
      })
    );
  };

  const handleWardChange = (code: string) => {
    if (!code) {
      onChange(
        withFullAddress({
          provinceCode: value.provinceCode,
          wardCode: '',
          street: value.street,
          provinceName: value.provinceName,
          wardName: '',
        })
      );
      return;
    }
    const ward = wards.find((w) => w.code === Number(code));
    onChange(
      withFullAddress({
        provinceCode: value.provinceCode,
        wardCode: Number(code),
        street: value.street,
        provinceName: value.provinceName,
        wardName: ward?.name ?? '',
      })
    );
  };

  const handleStreetChange = (street: string) => {
    onChange(withFullAddress({ ...value, street }, street));
  };

  return (
    <div className="space-y-4">
      <p className="font-tech text-[9px] text-on-surface-variant/70 uppercase tracking-widest">
        {VN_PROVINCE_COUNT} tỉnh/thành sau sáp nhập 07/2025 · Phường/xã trực thuộc
      </p>

      {loadError && (
        <p className="font-tech text-[10px] text-amber-600 uppercase tracking-widest">{loadError}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">
            Tỉnh / Thành phố
          </label>
          <div className="relative">
            <select
              value={value.provinceCode === '' ? '' : String(value.provinceCode)}
              onChange={(e) => handleProvinceChange(e.target.value)}
              disabled={disabled || loadingProvinces}
              className={selectClass}
            >
              <option value="">Chọn tỉnh/thành ({provinces.length})</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
            {loadingProvinces && (
              <Loader2
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-secondary pointer-events-none"
              />
            )}
          </div>
        </div>

        <div>
          <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">
            Phường / Xã
          </label>
          <div className="relative">
            <select
              value={value.wardCode === '' ? '' : String(value.wardCode)}
              onChange={(e) => handleWardChange(e.target.value)}
              disabled={disabled || !value.provinceCode || loadingWards}
              className={selectClass}
            >
              <option value="">
                {value.provinceCode ? 'Chọn phường/xã' : 'Chọn tỉnh/thành trước'}
              </option>
              {wards.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
            {loadingWards && (
              <Loader2
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-secondary pointer-events-none"
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">
          Số nhà, tên đường
        </label>
        <input
          value={value.street}
          onChange={(e) => handleStreetChange(e.target.value)}
          disabled={disabled}
          placeholder="VD: 123 Đường Láng"
          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm outline-none focus:border-secondary transition-all disabled:opacity-50"
        />
      </div>

      {value.fullAddress && (
        <p className="font-body text-xs text-on-surface-variant leading-relaxed">
          <span className="font-tech text-[10px] uppercase tracking-widest text-secondary">Xem trước: </span>
          {value.fullAddress}
        </p>
      )}
    </div>
  );
}
