import { Breadcrumb } from '@/components/layout/breadcrumb';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Terms & Conditions' },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary-700">Terms & Conditions</h1>
          <p className="text-muted-foreground">
            Last Updated: April 24, 2026
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6">
          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the VeilVogue website, you accept and agree to be bound by these Terms
              and Conditions. If you do not agree to these terms, please do not use our website or services.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Use of Website</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You agree to use our website only for lawful purposes and in a way that does not infringe
                the rights of others or restrict their use of the website.
              </p>
              <p className="text-muted-foreground font-semibold">Prohibited activities include:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Using the website for any illegal or unauthorized purpose</li>
                <li>Attempting to gain unauthorized access to our systems</li>
                <li>Interfering with the proper functioning of the website</li>
                <li>Transmitting viruses or malicious code</li>
                <li>Collecting user information without consent</li>
                <li>Impersonating another person or entity</li>
              </ul>
            </div>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Account Registration</h2>
            <p className="text-muted-foreground mb-4">
              To place orders, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to provide accurate product descriptions, images, and pricing. However, we do not
              warrant that product descriptions, colors, or other content is accurate, complete, or error-free.
              We reserve the right to correct any errors and update information without prior notice.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Pricing and Payment</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                All prices are listed in Pakistani Rupees (PKR) and are subject to change without notice.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Prices include applicable taxes unless stated otherwise</li>
                <li>Delivery charges are additional and displayed at checkout</li>
                <li>We accept Cash on Delivery (COD), JazzCash, and Easypaisa</li>
                <li>Payment must be made in full before order processing</li>
                <li>We reserve the right to refuse or cancel orders for any reason</li>
              </ul>
            </div>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Order Processing and Delivery</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Order acceptance and delivery terms:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Orders are processed within 1-2 business days</li>
                <li>Delivery typically takes 3-7 business days within Pakistan</li>
                <li>Delivery times are estimates and not guaranteed</li>
                <li>We are not responsible for delays caused by courier services or unforeseen circumstances</li>
                <li>Risk of loss passes to you upon delivery</li>
              </ul>
            </div>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the
              property of VeilVogue or its content suppliers and is protected by intellectual property laws.
            </p>
            <p className="text-muted-foreground">
              You may not reproduce, distribute, modify, or create derivative works without our express
              written permission.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, VeilVogue shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of our website
              or products. Our total liability shall not exceed the amount you paid for the product in question.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website and products are provided "as is" without warranties of any kind, either express
              or implied. We do not warrant that the website will be uninterrupted, error-free, or free of
              viruses or other harmful components.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold VeilVogue harmless from any claims, damages, losses, or
              expenses arising from your violation of these Terms or your use of our website.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Pakistan.
              Any disputes shall be subject to the exclusive jurisdiction of the courts of Karachi, Pakistan.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately
              upon posting to the website. Your continued use of the website after changes constitutes
              acceptance of the modified Terms.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Severability</h2>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining
              provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="bg-gradient-to-r from-primary-50 to-beige-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span>{' '}
                <a href="mailto:legal@veilvogue.pk" className="text-primary-600 hover:underline">
                  legal@veilvogue.pk
                </a>
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> +92 300 1234567
              </p>
              <p className="text-sm">
                <span className="font-medium">Address:</span> Karachi, Pakistan
              </p>
            </div>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <p className="text-sm text-muted-foreground text-center">
              By using VeilVogue, you acknowledge that you have read, understood, and agree to be bound
              by these Terms & Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
