import { Breadcrumb } from '@/components/layout/breadcrumb';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy' },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary-700">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: April 24, 2026
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6">
          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At VeilVogue, we are committed to protecting your privacy and ensuring the security of your
              personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you visit our website and make purchases.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Personal Information</h3>
                <p className="text-muted-foreground">
                  When you create an account or place an order, we collect:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Shipping address</li>
                  <li>Payment information (processed securely through payment gateways)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Automatically Collected Information</h3>
                <p className="text-muted-foreground">
                  When you visit our website, we automatically collect:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring website</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send promotional emails (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
              <li>Provide customer support</li>
            </ul>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Delivery partners to fulfill your orders</li>
              <li>Payment processors to handle transactions securely</li>
              <li>Service providers who assist in operating our website</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-4 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Limited access to personal data</li>
              <li>Secure payment processing through trusted gateways</li>
            </ul>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies to enhance your browsing experience, remember your preferences, and analyze
              website traffic. You can control cookie settings through your browser, but disabling cookies
              may affect website functionality.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@veilvogue.pk" className="text-primary-600 hover:underline">
                privacy@veilvogue.pk
              </a>
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website is not intended for children under 13 years of age. We do not knowingly collect
              personal information from children. If you believe we have collected information from a child,
              please contact us immediately.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by
              posting the new policy on this page and updating the "Last Updated" date. We encourage you
              to review this policy periodically.
            </p>
          </section>

          <section className="bg-gradient-to-r from-primary-50 to-beige-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span>{' '}
                <a href="mailto:privacy@veilvogue.pk" className="text-primary-600 hover:underline">
                  privacy@veilvogue.pk
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
