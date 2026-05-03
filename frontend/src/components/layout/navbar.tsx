'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { removeAuthToken } from '@/lib/auth';
import { CATEGORIES } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = useCart((state) => state.getItemCount());
  const { user, isAuthenticated, clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    removeAuthToken();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-500">VeilVogue</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Categories
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {CATEGORIES.map((category) => (
                  <DropdownMenuItem key={category.id}>
                    <Link href={`/shop?category=${category.slug}`}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/shop">
              <Button variant="ghost">Shop</Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon with Badge */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary-500 text-xs text-white flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user?.name}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/orders')}>
                      My Orders
                    </DropdownMenuItem>
                    {user?.role === 'ADMIN' && (
                      <DropdownMenuItem onClick={() => router.push('/admin')}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => router.push('/login')}>
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/register')}>
                      Register
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                {/* Header */}
                <div className="flex flex-col space-y-6">
                  {/* Brand */}
                  <div className="flex items-center justify-between pt-2">
                    <Link href="/" className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary-500">VeilVogue</span>
                    </Link>
                  </div>

                  {/* Mobile Search Bar */}
                  <form onSubmit={handleSearch} className="relative w-full">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </form>

                  {/* User Section */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-primary-50/50 border border-primary-100">
                    <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      {isAuthenticated ? (
                        <div>
                          <p className="font-medium text-sm">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => router.push('/login')}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700 text-left"
                          >
                            Login
                          </button>
                          <button
                            onClick={() => router.push('/register')}
                            className="text-xs text-muted-foreground hover:text-foreground text-left"
                          >
                            Create Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cart Summary */}
                  {mounted && itemCount > 0 && (
                    <Link
                      href="/cart"
                      className="flex items-center justify-between p-4 rounded-lg bg-sage-50/50 border border-sage-100 hover:bg-sage-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="h-5 w-5 text-sage-600" />
                        <span className="font-medium">Shopping Cart</span>
                      </div>
                      <span className="h-6 w-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
                        {itemCount}
                      </span>
                    </Link>
                  )}

                  {/* Navigation */}
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                      Navigation
                    </p>
                    <Link
                      href="/shop"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Shop All</span>
                    </Link>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                      Categories
                    </p>
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        href={`/shop?category=${category.slug}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
                      >
                        <div className="h-2 w-2 rounded-full bg-primary-400" />
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Account Actions */}
                  {isAuthenticated && (
                    <div className="flex flex-col space-y-1 pt-4 border-t">
                      <button
                        onClick={() => router.push('/orders')}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left"
                      >
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        <span>My Orders</span>
                      </button>
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => router.push('/admin')}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-destructive/10 text-destructive transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
