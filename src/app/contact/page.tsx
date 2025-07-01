import Head from 'next/head';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact – Peerzada Store</title>
      </Head>

      <section className="px-6 py-16 bg-white text-gray-800 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-red-700">Get in Touch</h1>
          <p className="mt-2 text-lg">
            Questions, custom orders, or just want to say Salaam? We&apos;re here.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-2">📞 WhatsApp</h3>
            <a
              href="https://wa.me/923458340669"
              className="text-red-600 underline text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              +92 345 8340669
            </a>
            <p>Available 10AM – 8PM, Mon–Sat</p>

            <h3 className="text-xl font-semibold mt-6 mb-2">📍 Location</h3>
            <p>
              Church Street, Saddar, Karachi Division 74400, Pakistan
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">📧 Email</h3>
            <a href="mailto:hello@peerzadastore.store" className="text-red-600 underline">
              hello@peerzadastore.store
            </a>
          </div>

          {/* Contact Form */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border px-4 py-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border px-4 py-2 rounded"
              required
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              className="w-full border px-4 py-2 rounded"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Google Map */}
        <div className="mb-16">
          <iframe
            title="Our Location"
            width="100%"
            height="350"
            frameBorder="0"
            className="rounded shadow contact-map"
            src="https://maps.google.com/maps?q=24.8617308,67.0320881&z=15&output=embed"
            allowFullScreen
          ></iframe>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-red-700">FAQs</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg">🕒 How long does delivery take?</h4>
              <p>Usually 3–5 working days within Pakistan. Custom items may take a bit longer.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg">📦 Can I order in bulk?</h4>
              <p>Yes, we accept bulk orders for events, gifts, and corporate clients.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg">🎨 Can I choose my own design?</h4>
              <p>Absolutely! Just WhatsApp us your idea, and we’ll customize it for you.</p>
            </div>
            <div>
              <h4 className="font-semibold text-lg">💵 What payment methods do you accept?</h4>
              <p>Cash on Delivery, Easypaisa, JazzCash. Online card payment coming soon.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
