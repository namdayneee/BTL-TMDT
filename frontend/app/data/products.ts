export interface Product {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceNum: number;
  img: string;
  gallery?: string[];
  badges: string[];
  category: 'hoodie' | 'tee' | 'pants' | 'jacket' | 'accessories';
  colors: string[];
  fabric: string;
  gsm?: string;
  fit: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: 'vt-99281',
    name: 'VAULT CORE HOODIE',
    desc: 'Oversized / Xám Heather',
    price: '2.450.000₫',
    priceNum: 2450000,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdjpCtAejqwMxDhMsLXXtQYkJ-uzC5wOl2qtY99po8x7hezcwrTMp1N1uSGCF7X9H_eYklLJKoandiTZpW47G3xpp1g-oFeEZesmpfcK-r07rYv4vhzoSgKz9Pu4N_Fn0T0QXe-q2wHlYyU_c_qxCugapGA55e1qug-yB7-qfnLIbCImI8JI_VH1IOQLIFw94kclaRKohdI43OXfaZ0kiZ-KzzCcH53I-jEx3zdvGTpHzMdW4X5cm7Q1FHhJnpgve-UYcgobkXNeMb',
    badges: ['MỚI', 'THÀNH VIÊN'],
    category: 'hoodie',
    colors: ['#2a2a2a', '#0033fe', '#f5f5f1'],
    fabric: '100% Cotton',
    gsm: '450 GSM',
    fit: 'Oversized',
    inStock: true,
  },
  {
    id: 'vt-98422',
    name: 'CHROME SIGNATURE TEE',
    desc: 'Boxy Fit / Trắng Xương',
    price: '1.250.000₫',
    priceNum: 1250000,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhPQmyf7IshNddW1HDbPtW8dEuFZLOpAwLI1x7n6ZP1eMAcUadR_u0TWJ4U1WpNlTCBh1-QeDadPywVrltPq2K-a6hAp9F4_jCsH1haaHFWJjbwXC-h_dk8nDdW8YzJ-kHIqDSeNy1XXiLOwv5TD6j55_OJrXMvphUfCnflQ3bMEEflbErOpUMq0dBl0NlK4TH7Tz-zGhlTLTanyuUhK_dTS8WGcuoGKweW2HM1qKuzxxlmjZwXB9QHFnpu81B2vV_5GtG0gegpQLU',
    badges: ['MỚI'],
    category: 'tee',
    colors: ['#f5f5f1', '#2a2a2a'],
    fabric: '100% Cotton',
    gsm: '250 GSM',
    fit: 'Boxy',
    inStock: true,
  },
  {
    id: 'vt-78341',
    name: 'PHANTOM CARGO PANTS',
    desc: 'Relaxed / Đen Phantom',
    price: '1.950.000₫',
    priceNum: 1950000,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpByNjEAi_vlAG0F29Ukxyn17W6LKdszdfIDseHKUl-ElQKPLQ81PVU01WCGyVd8scJuWY27fnViajOVzCUQQ_N328UvrBBQ67XJnvQSvzTVPkj7MPDKh7vmsiyVbvKUzBZ95oZbtQQ8oCcUhTfxu9xVNJlDDtPm4xV3PYscoscfDDZhZz18j48qoseZyYnQyB80SZ5VKtH10R69i-STqGsi7lNVmNM94QAjpaUfDfcF9QdSRLVZZxw_e7qZBKgG86oyq3jrafmgGg',
    badges: ['MỚI'],
    category: 'pants',
    colors: ['#2a2a2a', '#444'],
    fabric: '98% Cotton, 2% Spandex',
    gsm: '320 GSM',
    fit: 'Relaxed',
    inStock: true,
  },
  {
    id: 'vt-67219',
    name: 'VAULT BOMBER JACKET',
    desc: 'Regular Fit / Đen / Thêu Chrome',
    price: '3.200.000₫',
    priceNum: 3200000,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9gDsbDQQyDbc6c0CjqYnFH0agh6ewXQAA8TVoWoh9KyHNMPOOlEDMpPwERiv3D2DxlxTksJSstvbd6eQafOmKqsEp1AdFSYo4lPiY5EO2qkxt2f4XPU8tEOFfr3CgiYkvKwBcrXlaumy4UkSgISz9aHC1pnZo0VNZBPQj7kgRQXx1XmxcLz7RngVv-y6WE9Y56Bp1WUoiRmScElb4Vj54F7P32QeGymRYs_lKiPrt9e6l29e3Vj-D0TIIG4jvcLRENSHj6xaNJFc_',
    badges: ['GIỚI HẠN'],
    category: 'jacket',
    colors: ['#2a2a2a', '#0033fe'],
    fabric: '100% Nylon Shell',
    gsm: '180 GSM',
    fit: 'Regular',
    inStock: true,
  },
  {
    id: 'vt-54832',
    name: 'STEALTH LONGSLEEVE',
    desc: 'Slim / Đen Midnight',
    price: '1.450.000₫',
    priceNum: 1450000,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwwgg1t09h6y7S3SdIPte_KZTY1PXaCrNmCwpypKmckdTrz-1qz1BrjZ1Nlu27gu6JbIh92em9jsbXWBhiMdj3w88DFSxdxWNAR8LlOUPlER5hyqkzBFsKJqTCDCvTDKM-neyCcdQdkyWpk5lW95zgA7Se8C6ZAIM1LduyC8dYWNjiXWB7-3M7678fiCB9_vv7C5zZ6o8lzouC5eNpBtf5Fm8rEwe5ZoDthREKusiz0TOkemuaVMRtkaOmOdkK5wKYC0wZBuEfkAfd',
    badges: ['THÀNH VIÊN'],
    category: 'tee',
    colors: ['#2a2a2a'],
    fabric: '100% Cotton',
    gsm: '280 GSM',
    fit: 'Slim',
    inStock: true,
  },
  {
    id: 'vt-43761',
    name: 'CHROME SWEATSHIRT',
    desc: 'Oversized / Xám Chrome',
    price: '1.750.000₫',
    priceNum: 1750000,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARsbRr8jOHsmXsQs2c7ASX1yGBSPFumUKNDDQjVuVtvU31A0fQgXqV-IQEIQrILhBV6h8LVRe5jWf7GJ-ikOjHQDFw7A42myZOaHl9tH4iffIw1wGsVP3PRQLvrdGzjwnMk6dXohyReUwvjAvTfjzdmjOPGkycZBs2tf2i2yfc6ZdHl_tmS87X4xDHR6_VmNm4MFG1Yc2JAZ-snuNJeY1EAKT1Vy-4nUXXbzzvDhH3adv1B9ZwINPVU2F4rbcu_gbCRRRIyUWNzI0m',
    badges: [],
    category: 'hoodie',
    colors: ['#9ca3af', '#2a2a2a'],
    fabric: '80% Cotton, 20% Polyester',
    gsm: '380 GSM',
    fit: 'Oversized',
    inStock: true,
  },
  {
    id: 'vt-32894',
    name: 'VAULT TRACK JACKET',
    desc: 'Regular / Xanh Electric',
    price: '2.100.000₫',
    priceNum: 2100000,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9tZG5QFKLNqZxlRw4YbUxDF8riQDNIDwiOe4AnZluRelwGzr5erh7sigSJCEVfBmtQS28HNJnSoCAx8C9jIeSuu8GdKgB20eRiWAnPxjZmsybnC8Da68WpUa2h8fCPFqYvOvYzOUeGPt0LuBbjTjMwNGeWD3nNErFGka2OugecaT7AIXkL-vv8sti5q6P84sRei8X6Rfo82iok_sa3gaLH5QWTapP8WnPv_a9ykHrsSU9PH5GT-RJdnoV9aTad_0QqlUbPNHY39Zz',
    badges: ['MỚI', 'GIỚI HẠN'],
    category: 'jacket',
    colors: ['#0033fe', '#2a2a2a'],
    fabric: '100% Polyester',
    gsm: '200 GSM',
    fit: 'Regular',
    inStock: true,
  },
  {
    id: 'vt-21053',
    name: 'UTILITY VEST',
    desc: 'Oversized / Đen Tactical',
    price: '1.650.000₫',
    priceNum: 1650000,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0K87KeV3JI8Mrd0YQEKAYR3Y_wCcwIvcH1pb-_2Z5lxc1MZXQyublodoVcOGxq3w320kDFuT164pzq2pvk2kv6DYYLlpfvDFBNssItnRd7WtKi8SGx0AYDmpU1SoKRvP-pVbUKDziwYgikiaDsPM1ABTdhZGJkS8p6-PVMWIfFbpx4qReXzftpU-iXYZW-_iTZ_G0xgatR_cmKqBF9CUtipPOLDI2SkIfGQicO3UxLr3LCSPVG0GEhr3J3Z4EV4kB34c8iwd9TY-e',
    badges: [],
    category: 'jacket',
    colors: ['#2a2a2a'],
    fabric: '100% Nylon',
    gsm: '160 GSM',
    fit: 'Oversized',
    inStock: false,
  },
];

export const categories = [
  { id: 'all', label: 'Tất cả' },
  { id: 'hoodie', label: 'Hoodie' },
  { id: 'tee', label: 'T-Shirt' },
  { id: 'pants', label: 'Quần' },
  { id: 'jacket', label: 'Jacket' },
  { id: 'accessories', label: 'Phụ kiện' },
] as const;

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
