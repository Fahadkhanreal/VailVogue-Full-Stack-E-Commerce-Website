-- Update product images with working placeholder URLs
UPDATE "Product" 
SET images = ARRAY[
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
  'https://images.unsplash.com/photo-1583391733981-3e1b0c0b0b0b?w=800'
]
WHERE slug = 'elegant-black-abaya';
