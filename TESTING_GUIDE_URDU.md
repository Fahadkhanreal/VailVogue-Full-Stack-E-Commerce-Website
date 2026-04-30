# VeilVogue - Complete Testing Guide (اردو)

## 🧪 مکمل ٹیسٹنگ فلو

### Step 1: اکاؤنٹ بنائیں (Register)

1. Browser میں جائیں: http://localhost:3000/register
2. فارم بھریں:
   - **Name:** آپ کا نام (مثال: Ahmed Khan)
   - **Email:** test@example.com
   - **Password:** password123
   - **Confirm Password:** password123
   - **Phone (Optional):** 03001234567
3. "Create Account" پر کلک کریں
4. آپ automatically login ہو جائیں گے

### Step 2: Products دیکھیں

1. Homepage پر جائیں: http://localhost:3000
2. یا Shop page: http://localhost:3000/shop
3. Products کی list نظر آئے گی

### Step 3: Cart میں Add کریں

1. کسی بھی product پر کلک کریں
2. Size select کریں (S, M, L, XL)
3. "Add to Cart" button پر کلک کریں
4. Navbar میں cart icon پر number نظر آئے گا

### Step 4: Cart دیکھیں

1. Navbar میں cart icon پر کلک کریں
2. یا جائیں: http://localhost:3000/cart
3. آپ کے cart items نظر آئیں گے
4. "Proceed to Checkout" پر کلک کریں

### Step 5: Checkout (ادائیگی)

1. **Shipping Details بھریں:**
   - Name: آپ کا نام
   - Phone: 03001234567
   - Address: مکمل پتہ (مثال: House 123, Street 5, DHA Phase 2, Karachi)

2. **Payment Method منتخب کریں:**
   - ✅ **Easypaisa** (آپ یہ select کریں)
   - یا COD
   - یا JazzCash

3. "Place Order" button پر کلک کریں

### Step 6: Order Confirmation

1. Order successfully place ہو جائے گا
2. Order ID نظر آئے گی
3. Order details دیکھ سکتے ہیں
4. WhatsApp button سے order کی details share کر سکتے ہیں

### Step 7: Order History دیکھیں

1. Navbar میں "My Orders" پر کلک کریں
2. یا جائیں: http://localhost:3000/orders
3. آپ کے تمام orders کی list نظر آئے گی
4. کسی order پر کلک کر کے details دیکھیں

---

## ✅ Testing Checklist

- [ ] Account بنایا
- [ ] Login کیا
- [ ] Products دیکھے
- [ ] Product cart میں add کیا
- [ ] Cart میں items نظر آئے
- [ ] Checkout page پر گئے
- [ ] Shipping details بھریں
- [ ] Easypaisa payment method select کیا
- [ ] Order place کیا
- [ ] Order confirmation نظر آیا
- [ ] My Orders میں order دیکھا
- [ ] WhatsApp button test کیا

---

## 🐛 اگر کوئی مسئلہ آئے

**Cart empty ہو جائے:**
- Browser refresh کریں
- Dobara product add کریں

**Login نہیں ہو رہا:**
- Email aur password check کریں
- Browser console میں errors دیکھیں

**Order place نہیں ہو رہا:**
- Shipping details complete بھریں
- Phone number 03XXXXXXXXX format میں ہو
- Browser console میں errors دیکھیں

---

## 📞 WhatsApp Integration

Order place کرنے کے بعد:
1. "Contact via WhatsApp" button پر کلک کریں
2. WhatsApp automatically open ہو گا
3. Order details pre-filled ہوں گی
4. Message send کر سکتے ہیں

---

**Testing شروع کریں:** http://localhost:3000

