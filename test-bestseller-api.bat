@echo off
echo Testing Bestseller API...
echo.
curl "http://localhost:5000/api/products?bestseller=true&limit=4"
echo.
echo.
pause
