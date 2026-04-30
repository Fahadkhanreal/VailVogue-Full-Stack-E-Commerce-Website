import { Breadcrumb } from '@/components/layout/breadcrumb';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'About Us' },
        ]}
      />

      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary-700">About VeilVogue</h1>
          <p className="text-xl text-muted-foreground">
            Redefining Modest Fashion for the Modern Pakistani Woman
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-6">
          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              VeilVogue was born from a simple belief: modest fashion should never compromise on style,
              quality, or elegance. Founded in Pakistan, we understand the unique needs of women who seek
              to express their faith and cultural values through their clothing choices while embracing
              contemporary fashion trends.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our journey began with a vision to create a premium e-commerce platform that celebrates
              modesty as a form of empowerment. Every piece in our collection is carefully curated to
              ensure it meets our high standards of quality, comfort, and modest elegance.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To provide Pakistani women with access to premium modest fashion that combines traditional
              values with modern aesthetics. We believe every woman deserves to feel confident, elegant,
              and comfortable in what she wears.
            </p>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Premium Quality</h3>
                <p className="text-muted-foreground">
                  Every product is crafted from high-quality fabrics that ensure comfort and durability.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Modest Designs</h3>
                <p className="text-muted-foreground">
                  Our collection features elegant designs that honor modesty while staying fashion-forward.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Affordable Luxury</h3>
                <p className="text-muted-foreground">
                  Premium fashion shouldn't break the bank. We offer competitive prices without compromising quality.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Customer First</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We're here to help you find the perfect outfit.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-card rounded-lg border p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Collection</h2>
            <p className="text-muted-foreground leading-relaxed">
              From elegant Abayas perfect for formal occasions to comfortable everyday Kurtis, from
              premium Hijabs to stylish accessories - our collection is designed to meet all your
              modest fashion needs. Each piece is selected with care to ensure it reflects our
              commitment to quality and style.
            </p>
          </section>

          <section className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Become part of a growing community of women who celebrate modest fashion.
              Follow us on social media and stay updated with our latest collections and exclusive offers.
            </p>
            <p className="text-lg font-medium text-primary-700">
              Thank you for choosing VeilVogue - Where Modesty Meets Elegance
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
