import { Category, Size, PaymentMethod } from '@/types';

// Category IDs from database (Neon PostgreSQL)
export const CATEGORIES: { id: string; name: Category; slug: string; image: string }[] = [
  {
    id: '8137749e-d25a-4f22-9d43-a92c85797881',
    name: 'Abayas',
    slug: 'abayas',
    image: 'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777460039/9a6844d1ffd6c7289ad385af69dc9e15_ho7bcn.jpg'
  },
  {
    id: '7e490d61-6dc7-4fae-ab90-495762fa2f47',
    name: 'Dresses',
    slug: 'dresses',
    image: 'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777460567/alexander-jawfox-GNd5gstTSg8-unsplash_bvagcn.jpg'
  },
  {
    id: 'ad9f721b-efac-4dce-b38e-86f501ebb6ed',
    name: 'Kurtis',
    slug: 'kurtis',
    image: 'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777460731/imana-a5Ow9rAf3ZI-unsplash_tvseem.jpg'
  },
  {
    id: 'e3086f43-4a0b-41d6-80cb-ac1e19c217c0',
    name: 'Hijabs',
    slug: 'hijabs',
    image: 'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777377639/j12mkn9u0o7danvlqma7.jpg'
  },
  {
    id: 'd020445c-f067-4fc8-a3f4-b33b1b7aa936',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777460828/marissa-grootes-D4jRahaUaIc-unsplash_nhyksq.jpg'
  },
] as const;

export const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const PAYMENT_METHODS: { id: PaymentMethod; name: string }[] = [
  { id: 'COD', name: 'Cash on Delivery' },
  { id: 'JazzCash', name: 'JazzCash' },
  { id: 'Easypaisa', name: 'Easypaisa' },
] as const;
