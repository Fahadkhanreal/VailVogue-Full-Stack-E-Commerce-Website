import { Breadcrumb } from '@/components/layout/breadcrumb';
import { MessageCircle, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Contact Us' },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary-700">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            We're here to help! Reach out to us through any of the following channels
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* WhatsApp Contact */}
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">Chat with us instantly</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Get quick responses to your queries. Our team is available to assist you with orders,
              product information, and any questions you may have.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>

          {/* Email Contact */}
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-sm text-muted-foreground">Send us a message</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              For detailed inquiries, bulk orders, or business partnerships, feel free to email us.
              We typically respond within 24 hours.
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">General Inquiries:</span>{' '}
                <a href="mailto:info@veilvogue.pk" className="text-primary-600 hover:underline">
                  info@veilvogue.pk
                </a>
              </p>
              <p className="text-sm">
                <span className="font-medium">Customer Support:</span>{' '}
                <a href="mailto:support@veilvogue.pk" className="text-primary-600 hover:underline">
                  support@veilvogue.pk
                </a>
              </p>
            </div>
          </div>

          {/* Phone Contact */}
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-sm text-muted-foreground">Call us directly</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Speak with our customer service team for immediate assistance with your orders or queries.
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Customer Service:</span>{' '}
                <a href={`tel:+${whatsappNumber}`} className="text-primary-600 hover:underline">
                  +{whatsappNumber}
                </a>
              </p>
              <p className="text-xs text-muted-foreground">
                Available: Monday - Saturday, 10:00 AM - 8:00 PM PKT
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-sage-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-sage-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Visit Us</h3>
                <p className="text-sm text-muted-foreground">Our location</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Visit our showroom to experience our collection in person and get personalized styling advice.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">VeilVogue Showroom</p>
              <p className="text-sm text-muted-foreground">
                Karachi, Pakistan
              </p>
              <p className="text-xs text-muted-foreground">
                Showroom Hours: Monday - Saturday, 11:00 AM - 7:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-primary-50 to-beige-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">How can I track my order?</h3>
              <p className="text-sm text-muted-foreground">
                Once your order is shipped, you'll receive a tracking number via WhatsApp or email.
                You can use this to track your delivery status.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What are your delivery charges?</h3>
              <p className="text-sm text-muted-foreground">
                We charge a flat delivery fee of Rs. 200 for orders across Pakistan.
                Free delivery on orders above Rs. 5000.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you accept returns?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! We accept returns within 7 days of delivery. Please check our Return & Refund Policy
                for detailed information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
