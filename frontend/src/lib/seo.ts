export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VeilVogue',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
    description: 'Premium modest fashion clothing for Pakistani women',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PK',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Urdu'],
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  category: string;
  stock: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img => `${baseUrl}${img}`),
    category: product.category,
    offers: {
      '@type': 'Offer',
      price: product.discountedPrice || product.price,
      priceCurrency: 'PKR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'VeilVogue',
      },
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}
