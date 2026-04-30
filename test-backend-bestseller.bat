@echo off
echo ========================================
echo Testing Backend Bestseller API
echo ========================================
echo.
echo Testing: http://localhost:5000/api/products?bestseller=true
echo.
curl -s "http://localhost:5000/api/products?bestseller=true&limit=2"
echo.
echo.
echo ========================================
echo If you see "success":true and products with "bestseller":true
echo then backend is working correctly!
echo.
echo If you see "success":false or 500 error
echo then backend server needs to be restarted.
echo ========================================
echo.
pause
