'use client';

import { useState } from 'react';
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
import { CATEGORIES, SIZES } from '@/lib/constants';
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

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      bestseller: false,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error('Cloudinary configuration missing');
      return;
    }

    setIsLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
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
          console.error('Cloudinary Error Response:', errorData);
          throw new Error(`Image upload failed: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setIsLoading(false);
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

    setIsLoading(true);
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
        colors: [], // Add color selection if needed
        images: images,
        stock: data.stock,
        featured: data.featured,
        bestseller: data.bestseller,
      };

      // Call backend API
      const { api } = await import('@/lib/api');
      const response = await api.post('/api/products', productData, true);

      toast.success('Product created successfully!', {
        description: `${data.name} has been added to your store.`
      });
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Create product error:', error);
      toast.error('Failed to create product', {
        description: error.message || 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl sm:text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-2">
          Create a new product for your store
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
              <Input
                id="name"
                placeholder="Elegant Black Abaya"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Premium quality abaya with intricate embroidery..."
                rows={4}
                {...register('description')}
              />
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
                  placeholder="4500"
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
                  placeholder="10"
                  {...register('discount', { valueAsNumber: true })}
                />
                {errors.discount && (
                  <p className="text-sm text-destructive">{errors.discount.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value: string | null) => {
                if (value) setValue('category', value);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
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
                placeholder="25"
                {...register('stock', { valueAsNumber: true })}
              />
              {errors.stock && (
                <p className="text-sm text-destructive">{errors.stock.message}</p>
              )}
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
              />
              <label htmlFor="images" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload images
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
                onCheckedChange={(checked) => setValue('featured', checked as boolean)}
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured Product
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bestseller"
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
          <Button type="submit" disabled={isLoading} className="w-full sm:flex-1">
            {isLoading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
