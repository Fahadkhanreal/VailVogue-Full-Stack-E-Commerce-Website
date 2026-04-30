import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <footer className="border-t bg-beige-50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary-500">VeilVogue</h3>
            <p className="text-sm text-muted-foreground">
              Premium modest fashion for Pakistani women. Discover elegant Abayas, Dresses, Kurtis, Hijabs, and Accessories.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary-500">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h4 className="font-semibold">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policies/privacy" className="text-muted-foreground hover:text-primary-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/return" className="text-muted-foreground hover:text-primary-500">
                  Return & Refund
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-muted-foreground hover:text-primary-500">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary-500"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VeilVogue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
