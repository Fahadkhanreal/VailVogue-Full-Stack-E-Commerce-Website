# VeilVogue Testing Checklist

## ✅ Products Successfully Added

Total Products: **6**

1. **Elegant Black Abaya** (Abayas) - Rs. 3500 → Rs. 2999
2. **Premium Silk Hijab** (Hijabs) - Rs. 1500 → Rs. 1200
3. **Floral Print Kurti** (Kurtis) - Rs. 2500 → Rs. 1999
4. **Modest Summer Dress** (Dresses) - Rs. 3200 → Rs. 2800
5. **Chiffon Hijab Set** (Hijabs) - Rs. 1800 → Rs. 1500
6. **Pearl Brooch Set** (Accessories) - Rs. 800 → Rs. 650

## 🧪 Test Cases

### 1. Homepage Testing
- [ ] Visit http://localhost:3000
- [ ] Verify featured products section shows 3 products (featured=true)
- [ ] Check all product images load correctly
- [ ] Verify prices and discount badges display

### 2. Shop Page Testing
- [ ] Visit http://localhost:3000/shop
- [ ] Verify all 6 products display
- [ ] Test search functionality
- [ ] Test price sorting (Low to High, High to Low)

### 3. Category Filter Testing
**Abayas:**
- [ ] Select "Abayas" filter
- [ ] Should show: 1 product (Elegant Black Abaya)
- [ ] Direct URL: http://localhost:3000/shop?category=abayas

**Kurtis:**
- [ ] Select "Kurtis" filter
- [ ] Should show: 1 product (Floral Print Kurti)
- [ ] Direct URL: http://localhost:3000/shop?category=kurtis

**Hijabs:**
- [ ] Select "Hijabs" filter
- [ ] Should show: 2 products (Premium Silk Hijab, Chiffon Hijab Set)
- [ ] Direct URL: http://localhost:3000/shop?category=hijabs

**Dresses:**
- [ ] Select "Dresses" filter
- [ ] Should show: 1 product (Modest Summer Dress)
- [ ] Direct URL: http://localhost:3000/shop?category=dresses

**Accessories:**
- [ ] Select "Accessories" filter
- [ ] Should show: 1 product (Pearl Brooch Set)
- [ ] Direct URL: http://localhost:3000/shop?category=accessories

### 4. Product Detail Pages
- [ ] http://localhost:3000/product/premium-silk-hijab
- [ ] http://localhost:3000/product/elegant-black-abaya
- [ ] http://localhost:3000/product/floral-print-kurti
- [ ] http://localhost:3000/product/modest-summer-dress
- [ ] http://localhost:3000/product/chiffon-hijab-set
- [ ] http://localhost:3000/product/pearl-brooch-set

### 5. Add to Cart Testing
- [ ] Select a product
- [ ] Choose size
- [ ] Click "Add to Cart"
- [ ] Verify cart count updates in navbar
- [ ] Visit cart page
- [ ] Verify product appears with correct details

### 6. Checkout Flow (Requires Login)
- [ ] Add products to cart
- [ ] Click "Proceed to Checkout"
- [ ] Login/Register if needed
- [ ] Fill shipping details
- [ ] Select payment method
- [ ] Place order
- [ ] Verify order confirmation page
- [ ] Check order in "My Orders"

### 7. Admin Dashboard (Admin Login Required)
- [ ] Login as admin (admin@veilvogue.com / Admin123)
- [ ] Visit http://localhost:3000/admin
- [ ] Verify dashboard statistics
- [ ] Check products count: 6
- [ ] View orders list

## 🔧 Quick Commands

### Add More Products
```bash
cd backend
node add-product.js              # Add single product
node add-multiple-products.js    # Add multiple products
```

### Check Database
```bash
cd backend
npx prisma studio                # Open Prisma Studio GUI
```

### View All Products
```bash
curl http://localhost:5000/api/products?limit=20
```

### Test Category Filter
```bash
curl "http://localhost:5000/api/products?category=hijabs"
```

## 🐛 Common Issues

### Products Not Showing
1. Check backend is running: http://localhost:5000/health
2. Check frontend is running: http://localhost:3000
3. Check browser console for errors
4. Verify .env.local has correct API_URL

### Category Filter Not Working
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check browser console for API errors

### Images Not Loading
1. Verify Cloudinary URLs are correct
2. Check Next.js image configuration in next.config.ts
3. Check browser console for image errors

## ✅ Success Criteria

- [ ] All 6 products visible on shop page
- [ ] Category filters work correctly
- [ ] Product detail pages load
- [ ] Add to cart functionality works
- [ ] Checkout flow completes successfully
- [ ] Orders appear in "My Orders"
- [ ] Admin dashboard shows correct statistics

---

**Last Updated:** 2026-04-28
**Status:** ✅ All Core Features Working
