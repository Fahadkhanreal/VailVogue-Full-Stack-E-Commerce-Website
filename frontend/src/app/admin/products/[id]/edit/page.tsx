'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { CATEGORIES, SIZES } from '@/lib/constants';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  discount: z.number().min(0).max(100).optional(),
  category: z.string(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  featured: z.boolean(),
  bestseller: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: {
    id: string;
    name: string;
  };
  sizes: string[];
  images: string[];
  stock: number;
  featured: boolean;
  bestseller: boolean;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await api.get<any>(`/api/products/${id}`, true);
        const productData = response.data;
        setProduct(productData);
        setSelectedSizes(productData.sizes || []);
        setImages(productData.images || []);

        // Calculate discount percentage
        const discount = productData.discountPrice
          ? Math.round(((productData.price - productData.discountPrice) / productData.price) * 100)
          : 0;

        // Set form values
        reset({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          discount: discount,
          category: productData.category.name,
          stock: productData.stock,
          featured: productData.featured || false,
          bestseller: productData.bestseller || false,
        });
      } catch (error) {
        const errorMessage = error instanceof ApiError
          ? error.message
          : 'Failed to load product';
        toast.error('Error', { description: errorMessage });
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id, reset]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary configuration missing');
      return;
    }

    setIsUploadingImage(true);
    const uploadedUrls: string[] = [];
    const failedUploads: string[] = [];

    try {
      console.log(`📤 Starting upload for ${files.length} files`);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`📤 Uploading file ${i + 1}/${files.length}: ${file.name}`);

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error(`❌ Upload failed for ${file.name}:`, errorData);
            failedUploads.push(file.name);
            continue;
          }

          const data = await response.json();
          uploadedUrls.push(data.secure_url);
          console.log(`✅ Uploaded ${file.name}: ${data.secure_url}`);
        } catch (error) {
          console.error(`❌ Error uploading ${file.name}:`, error);
          failedUploads.push(file.name);
        }
      }

      console.log('📸 Uploaded URLs:', uploadedUrls);
      console.log('📸 Current images before:', images);

      if (uploadedUrls.length > 0) {
        setImages([...images, ...uploadedUrls]);
        console.log('📸 Current images after:', [...images, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
      }

      if (failedUploads.length > 0) {
        toast.error(`Failed to upload: ${failedUploads.join(', ')}`);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (selectedSizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSaving(true);
    try {
      // Get category ID from category name
      const category = CATEGORIES.find(c => c.name === data.category);
      if (!category) {
        toast.error('Invalid category selected');
        return;
      }

      // Prepare product data for backend
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        discountPrice: data.discount ? data.price - (data.price * data.discount / 100) : undefined,
        categoryId: category.id,
        sizes: selectedSizes,
        colors: [], // Keep existing colors or add color selection if needed
        images: images,
        stock: data.stock,
        featured: data.featured,
        bestseller: data.bestseller,
      };

      console.log('📝 Updating product with images:', images);
      console.log('📝 Total images count:', images.length);
      console.log('📝 Product data:', productData);
      const response = await api.put(`/api/products/${id}`, productData, true);
      console.log('✅ Update response:', response);

      toast.success('Product updated successfully!', {
        description: `${data.name} has been updated.`
      });
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Update product error:', error);
      toast.error('Failed to update product', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={1} height="h-12" className="w-64" />
        <LoadingSkeleton count={3} height="h-32" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/admin/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Update product details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Details Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} {...register('description')} />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (PKR)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  {...register('discount', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                defaultValue={product.category.name}
                onValueChange={(value: string | null) => {
                  if (value) setValue('category', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Available Sizes</Label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant={selectedSizes.includes(size) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedSizes(
                        selectedSizes.includes(size)
                          ? selectedSizes.filter((s) => s !== size)
                          : [...selectedSizes, size]
                      );
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                {...register('stock', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Images Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploadingImage}
              />
              <label htmlFor="images" className={isUploadingImage ? 'cursor-not-allowed' : 'cursor-pointer'}>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {isUploadingImage ? 'Uploading...' : 'Click to upload images'}
                </p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                    <img src={img} alt={`Product ${index + 1}`} className="object-cover w-full h-full" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                defaultChecked={product.featured}
                onCheckedChange={(checked) => setValue('featured', checked as boolean)}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured Product
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bestseller"
                defaultChecked={product.bestseller}
                onCheckedChange={(checked) => setValue('bestseller', checked as boolean)}
              />
              <Label htmlFor="bestseller" className="cursor-pointer">
                Bestseller
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sticky bottom-0 bg-background py-4 border-t">
          <Link href="/admin/products" className="w-full sm:w-auto sm:flex-1">
            <Button type="button" variant="outline" className="w-full">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSaving || isUploadingImage} className="w-full sm:flex-1">
            {isSaving ? 'Updating...' : 'Update Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
