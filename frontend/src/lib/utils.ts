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

// Automatically optimize image URLs (Cloudinary & Unsplash)
export function optimizeImageUrl(url?: string, width: number = 800): string {
  if (!url) return '/placeholder.svg'

  // Cloudinary optimization (f_auto, q_auto, w_X)
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`)
    }
  }

  // Unsplash optimization
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?'
    if (!url.includes('auto=format')) {
      return `${url}${separator}auto=format&fit=crop&w=${width}&q=75`
    }
  }

  return url
}
