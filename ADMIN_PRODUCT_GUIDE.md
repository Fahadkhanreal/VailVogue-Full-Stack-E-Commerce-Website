# Admin Dashboard - Product Management Guide

## 🔐 Admin Login

**Step 1: Login as Admin**
1. Open: http://localhost:3000/login
2. Enter credentials:
   - Email: `admin@veilvogue.com`
   - Password: `Admin123`
3. Click "Login"

---

## ➕ Add New Product via Admin Dashboard

### Step 1: Navigate to Add Product Page
1. After login, click "Admin Dashboard" in navbar
2. Go to: http://localhost:3000/admin/products/new
3. Or click "Add New Product" button from products page

### Step 2: Fill Product Details

**Basic Information:**
- **Product Name**: Enter product name (e.g., "Premium Cotton Kurti")
- **Description**: Detailed description (minimum 10 characters)
- **Price (PKR)**: Enter price (e.g., 2500)
- **Discount (%)**: Optional discount percentage (e.g., 10 for 10% off)

**Category Selection:**
- Click dropdown and select category:
  - Abayas
  - Dresses
  - Kurtis
  - Hijabs
  - Accessories

**Available Sizes:**
- Click size buttons to select (multiple selection allowed):
  - XS, S, M, L, XL, XXL
- Selected sizes will be highlighted

**Stock Quantity:**
- Enter available stock (e.g., 50)

### Step 3: Upload Product Images

**Image Upload Process:**
1. Click on "Click to upload images" area
2. Select one or multiple images from your computer
3. Images will be automatically uploaded to Cloudinary
4. Wait for upload confirmation toast
5. Uploaded images will appear in grid below
6. Click X button on any image to remove it

**Image Requirements:**
- Format: JPG, PNG, WEBP
- Recommended size: 800x1200px or higher
- Multiple images allowed (first image will be main)

### Step 4: Product Settings

**Optional Flags:**
- ☑️ **Featured Product**: Show on homepage featured section
- ☑️ **Bestseller**: Mark as bestseller (for future use)

### Step 5: Create Product

1. Review all entered information
2. Click "Create Product" button
3. Wait for success confirmation
4. You'll be redirected to products list page

---

## 📋 Product Creation Checklist

Before clicking "Create Product", verify:
- [ ] Product name is descriptive and unique
- [ ] Description is detailed (minimum 10 characters)
- [ ] Price is entered correctly
- [ ] Category is selected
- [ ] At least one size is selected
- [ ] Stock quantity is entered
- [ ] At least one image is uploaded
- [ ] Featured/Bestseller flags set as needed

---

## 🖼️ Image Upload Details

**Cloudinary Configuration:**
Your images are uploaded to Cloudinary with these settings:
- Cloud Name: `dlcz7wu8t`
- Upload Preset: `unsigned_preset`
- Images are stored permanently
- Automatic optimization and CDN delivery

**Upload Process:**
1. Select image file(s)
2. Frontend uploads to Cloudinary API
3. Cloudinary returns secure URL
4. URL is saved in product data
5. Images display on shop and product pages

---

## 🔍 View Created Products

**After Creating Product:**
1. Go to: http://localhost:3000/admin/products
2. View all products in table format
3. See product details: name, category, price, stock

**On Shop Page:**
1. Go to: http://localhost:3000/shop
2. Your new product will appear
3. Filter by category to find it
4. Click to view product detail page

---

## ✏️ Edit Product (Future Feature)

Currently, product editing is not connected. To edit:
1. Use Prisma Studio: `cd backend && npx prisma studio`
2. Or use backend script to update
3. Or wait for edit UI to be connected

---

## 🗑️ Delete Product (Future Feature)

Currently, product deletion is not connected. To delete:
1. Use Prisma Studio
2. Or use backend API directly
3. Or wait for delete UI to be connected

---

## 🐛 Troubleshooting

### Issue: "Category not found" error
**Solution:** Category IDs are now synced with database. Refresh page and try again.

### Issue: Image upload fails
**Solution:** 
1. Check .env.local has Cloudinary credentials:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlcz7wu8t
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
   ```
2. Check image file size (max 10MB recommended)
3. Check internet connection

### Issue: "Authentication required" error
**Solution:**
1. Make sure you're logged in as admin
2. Check admin credentials are correct
3. Try logout and login again

### Issue: Product not showing on shop page
**Solution:**
1. Refresh shop page (Ctrl+Shift+R)
2. Check product was created successfully
3. Verify category filter is not hiding it
4. Check backend API: `curl http://localhost:5000/api/products`

---

## 📊 Backend API Endpoints

**Create Product (Admin Only):**
```
POST http://localhost:5000/api/products
Authorization: Bearer <admin-token>

Body:
{
  "name": "Product Name",
  "description": "Product description",
  "price": 2500,
  "discountPrice": 2000,
  "categoryId": "category-uuid",
  "sizes": ["S", "M", "L"],
  "colors": ["Black", "White"],
  "images": ["https://cloudinary.com/..."],
  "stock": 50,
  "featured": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product-uuid",
    "name": "Product Name",
    "slug": "product-name",
    ...
  }
}
```

---

## 🎯 Quick Example

**Adding a New Kurti:**

1. Login as admin
2. Go to Add Product page
3. Fill details:
   - Name: "Floral Embroidered Kurti"
   - Description: "Beautiful floral embroidery on premium cotton fabric. Perfect for casual and formal wear."
   - Price: 2800
   - Discount: 15
   - Category: Kurtis
   - Sizes: S, M, L, XL
   - Stock: 40
4. Upload 3-4 product images
5. Check "Featured Product"
6. Click "Create Product"
7. Success! Product is now live

---

## 📝 Best Practices

**Product Names:**
- Be descriptive and specific
- Include key features (e.g., "Premium Silk Hijab")
- Keep under 60 characters

**Descriptions:**
- Mention fabric/material
- Describe fit and style
- Include care instructions
- Highlight unique features

**Pricing:**
- Use competitive pricing
- Offer discounts strategically
- Consider cost + margin

**Images:**
- Use high-quality photos
- Show product from multiple angles
- Include lifestyle shots if possible
- First image is most important (main display)

**Stock Management:**
- Keep stock updated
- Set realistic quantities
- Monitor popular items

---

## ✅ Success Checklist

After adding product, verify:
- [ ] Product appears in admin products list
- [ ] Product shows on shop page
- [ ] Product detail page loads correctly
- [ ] Images display properly
- [ ] Price and discount calculate correctly
- [ ] Category filter works
- [ ] Add to cart functionality works

---

**Need Help?** Check browser console (F12) for error messages or contact support.

**Last Updated:** 2026-04-28
