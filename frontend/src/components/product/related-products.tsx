import { Product } from '@/types';
import { ProductCard } from './product-card';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
