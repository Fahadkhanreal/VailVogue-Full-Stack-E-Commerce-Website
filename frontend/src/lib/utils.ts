import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Size } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format price for display
export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString('en-PK')}`
}

// Calculate discounted price
export function calculateDiscountedPrice(price: number, discount?: number): number {
  if (!discount || discount <= 0) return price
  return Math.round(price * (1 - discount / 100))
}

// Generate cart item ID
export function generateCartItemId(productId: string, size: Size, color?: string): string {
  return `${productId}-${size}${color ? `-${color}` : ''}`
}

// Type guard for checking if user is admin
export function isAdmin(userRole?: string): boolean {
  return userRole === 'ADMIN'
}
