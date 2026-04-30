import { Breadcrumb } from '@/components/layout/breadcrumb';

export default function ReturnPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Return & Refund Policy' },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary-700">Return & Refund Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: April 24, 2026
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6">
          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              At VeilVogue, we want you to be completely satisfied with your purchase. If you're not happy
              with your order, we're here to help with returns and refunds according to the policy outlined below.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Return Eligibility</h2>
            <p className="text-muted-foreground mb-4">
              You may return items within <strong>7 days</strong> of delivery if they meet the following conditions:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Items are unused, unworn, and unwashed</li>
              <li>Original tags and packaging are intact</li>
              <li>No signs of wear, damage, or alterations</li>
              <li>Items are in their original condition</li>
              <li>Proof of purchase (order number or receipt) is provided</li>
            </ul>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
            <p className="text-muted-foreground mb-4">
              For hygiene and safety reasons, the following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Hijabs and scarves (unless defective)</li>
              <li>Undergarments and innerwear</li>
              <li>Items marked as "Final Sale" or purchased during clearance sales</li>
              <li>Customized or personalized items</li>
              <li>Items without original tags or packaging</li>
            </ul>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Step 1: Contact Us</h3>
                <p className="text-muted-foreground">
                  Contact our customer service team within 7 days of receiving your order via:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>WhatsApp: +92 300 1234567</li>
                  <li>Email: returns@veilvogue.pk</li>
                  <li>Phone: +92 300 1234567</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Step 2: Return Authorization</h3>
                <p className="text-muted-foreground">
                  Provide your order number and reason for return. Our team will review your request and
                  provide return authorization and instructions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Step 3: Ship the Item</h3>
                <p className="text-muted-foreground">
                  Pack the item securely in its original packaging with all tags attached. Ship it to the
                  address provided by our customer service team.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Step 4: Inspection & Refund</h3>
                <p className="text-muted-foreground">
                  Once we receive and inspect your return, we'll process your refund within 5-7 business days.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Refunds will be processed to your original payment method:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Cash on Delivery (COD):</strong> Bank transfer or JazzCash/Easypaisa (provide account details)</li>
                <li><strong>JazzCash/Easypaisa:</strong> Refund to your mobile wallet within 5-7 business days</li>
                <li><strong>Bank Transfer:</strong> Refund to your bank account within 7-10 business days</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                <strong>Note:</strong> Original delivery charges are non-refundable. Return shipping costs are
                the customer's responsibility unless the item is defective or we made an error.
              </p>
            </div>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
            <p className="text-muted-foreground leading-relaxed">
              We currently do not offer direct exchanges. If you need a different size or color, please return
              the original item for a refund and place a new order for the desired item.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Defective or Damaged Items</h2>
            <p className="text-muted-foreground mb-4">
              If you receive a defective or damaged item:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Contact us immediately (within 48 hours of delivery)</li>
              <li>Provide photos of the defect or damage</li>
              <li>We'll arrange a free return pickup</li>
              <li>You'll receive a full refund including delivery charges, or a replacement</li>
            </ul>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Wrong Item Delivered</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you receive the wrong item, please contact us within 48 hours. We'll arrange a free return
              pickup and send you the correct item at no additional cost, or provide a full refund including
              delivery charges.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Late or Missing Refunds</h2>
            <p className="text-muted-foreground mb-4">
              If you haven't received your refund within the specified timeframe:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Check your bank account or mobile wallet again</li>
              <li>Contact your bank or payment provider (processing times may vary)</li>
              <li>If you've done all of this and still haven't received your refund, contact us at returns@veilvogue.pk</li>
            </ul>
          </section>

          <section className="bg-gradient-to-r from-primary-50 to-beige-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about our Return & Refund Policy, please don't hesitate to contact us:
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">WhatsApp:</span> +92 300 1234567
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span>{' '}
                <a href="mailto:returns@veilvogue.pk" className="text-primary-600 hover:underline">
                  returns@veilvogue.pk
                </a>
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> +92 300 1234567
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
