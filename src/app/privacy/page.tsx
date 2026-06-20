'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: (
      <>
        <p className="mb-4">
          When you use Peerzada Store, we may collect the following types of information:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li><strong className="text-gray-900">Personal Information:</strong> Name, email address, phone number, shipping address, and billing information when you place an order.</li>
          <li><strong className="text-gray-900">Account Information:</strong> Username, password, and profile data if you create an account on our platform.</li>
          <li><strong className="text-gray-900">Payment Information:</strong> Payment method details (processed securely through third-party payment processors — we do not store full payment card details).</li>
          <li><strong className="text-gray-900">Communication Data:</strong> Messages, inquiries, and correspondence you send to us via email, WhatsApp, or contact forms.</li>
          <li><strong className="text-gray-900">Usage Data:</strong> Information about how you interact with our website, including pages visited, time spent, clicks, and referring URLs.</li>
          <li><strong className="text-gray-900">Device Information:</strong> IP address, browser type, device type, operating system, and other technical data collected automatically.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: (
      <>
        <p className="mb-4">We use the information we collect for the following purposes:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li>To process and fulfill your orders, including order confirmation, shipping updates, and delivery tracking.</li>
          <li>To communicate with you about your orders, account, and customer service inquiries.</li>
          <li>To improve our website, products, and services based on user behavior and feedback.</li>
          <li>To send promotional emails and marketing communications (only with your explicit consent).</li>
          <li>To detect and prevent fraudulent transactions and ensure the security of our platform.</li>
          <li>To comply with legal obligations and enforce our terms of service.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'information-sharing',
    title: '3. Information Sharing & Disclosure',
    content: (
      <>
        <p className="mb-4">We respect your privacy and do not sell your personal information. We may share your data only in the following circumstances:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li><strong className="text-gray-900">Service Providers:</strong> With trusted third-party companies that help us operate our business (e.g., payment processors, shipping carriers, analytics providers). These parties are contractually bound to protect your data.</li>
          <li><strong className="text-gray-900">Legal Compliance:</strong> When required by law, court order, or government regulation to disclose information.</li>
          <li><strong className="text-gray-900">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.</li>
          <li><strong className="text-gray-900">With Your Consent:</strong> We may share your information for any other purpose with your explicit consent.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    content: (
      <>
        <p className="mb-4">
          We implement industry-standard security measures to protect your personal information, including:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li>SSL/TLS encryption for all data transmitted between your browser and our servers.</li>
          <li>Secure payment processing through PCI-compliant third-party gateways.</li>
          <li>Regular security audits and monitoring of our systems.</li>
          <li>Access controls and authentication measures for data access.</li>
        </ul>
        <p className="text-gray-600">
          While we strive to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but will promptly notify you in the event of any data breach that affects your information.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking Technologies',
    content: (
      <>
        <p className="mb-4">
          Peerzada Store uses cookies and similar tracking technologies to enhance your browsing experience. These include:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li><strong className="text-gray-900">Essential Cookies:</strong> Required for the website to function properly (e.g., session management, shopping cart).</li>
          <li><strong className="text-gray-900">Analytics Cookies:</strong> Help us understand how visitors use our website so we can improve it (e.g., Google Analytics).</li>
          <li><strong className="text-gray-900">Functional Cookies:</strong> Remember your preferences and settings for a personalized experience.</li>
          <li><strong className="text-gray-900">Marketing Cookies:</strong> Used to deliver relevant advertisements and measure campaign effectiveness (with your consent).</li>
        </ul>
        <p className="text-gray-600">
          You can control cookie preferences through your browser settings. Disabling certain cookies may affect the functionality of our website.
        </p>
      </>
    ),
  },
  {
    id: 'third-party',
    title: '6. Third-Party Services',
    content: (
      <>
        <p className="mb-4">Our website may include links to third-party websites and services. We also use the following third-party services:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li><strong className="text-gray-900">Payment Processors:</strong> Secure payment handling through third-party gateways.</li>
          <li><strong className="text-gray-900">Analytics:</strong> Google Analytics and Vercel Speed Insights for website performance monitoring.</li>
          <li><strong className="text-gray-900">Communication:</strong> WhatsApp for customer support and order inquiries.</li>
          <li><strong className="text-gray-900">Content Management:</strong> Sanity.io for managing our product catalog and content.</li>
        </ul>
        <p className="text-gray-600">
          These third-party services have their own privacy policies governing the use of your data. We encourage you to review their policies before using their services.
        </p>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: '7. Your Rights & Choices',
    content: (
      <>
        <p className="mb-4">Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li><strong className="text-gray-900">Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong className="text-gray-900">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong className="text-gray-900">Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
          <li><strong className="text-gray-900">Portability:</strong> Request transfer of your data to another service provider.</li>
          <li><strong className="text-gray-900">Opt-Out:</strong> Unsubscribe from marketing communications at any time by clicking the unsubscribe link in our emails.</li>
          <li><strong className="text-gray-900">Cookie Preferences:</strong> Manage your cookie preferences through your browser settings.</li>
        </ul>
        <p className="text-gray-600">
          To exercise any of these rights, please contact us at <strong className="text-gray-900">info@peerzada.store</strong>. We will respond to your request within 30 days.
        </p>
      </>
    ),
  },
  {
    id: 'data-retention',
    title: '8. Data Retention',
    content: (
      <>
        <p className="mb-4">
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li>Order information is retained for 5 years for tax and accounting purposes.</li>
          <li>Account information is retained until you request deletion of your account.</li>
          <li>Marketing communications data is retained until you opt out.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'children',
    title: '9. Children&apos;s Privacy',
    content: (
      <>
        <p className="mb-4">
          Peerzada Store does not knowingly collect personal information from children under the age of 13. If we become aware that a child has provided us with personal data, we will take steps to delete such information immediately.
        </p>
        <p className="text-gray-600">
          If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <strong className="text-gray-900">info@peerzada.store</strong>.
        </p>
      </>
    ),
  },
  {
    id: 'updates',
    title: '10. Changes to This Privacy Policy',
    content: (
      <>
        <p className="mb-4">
          We may update this privacy policy from time to time to reflect changes in our practices, legal requirements, or operational needs. We will notify you of any material changes by:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li>Posting the updated policy on this page with a new effective date.</li>
          <li>Sending an email notification if you have an account with us.</li>
          <li>Displaying a prominent notice on our website.</li>
        </ul>
        <p className="text-gray-600">
          We encourage you to review this policy periodically to stay informed about how we protect your information.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: '11. Contact Us',
    content: (
      <>
        <p className="mb-4">
          If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
        </p>
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B80000]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#B80000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <a href="mailto:info@peerzada.store" className="text-sm text-[#B80000] hover:text-red-700 transition-colors">
                info@peerzada.store
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B80000]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#B80000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.054-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Phone / WhatsApp</p>
              <a href="tel:+923458340668" className="text-sm text-[#B80000] hover:text-red-700 transition-colors">
                +92 345 8340668
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B80000]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#B80000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Address</p>
              <p className="text-sm text-gray-600">Pakistan</p>
            </div>
          </div>
        </div>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ========== HERO / HEADER ========== */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-[#B80000]/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-amber-400/10 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 bg-[#B80000]/10 rounded-full text-[#B80000] text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#B80000] rounded-full animate-pulse" />
              Legal &amp; Compliance
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-4"
            >
              Privacy{' '}
              <span className="bg-gradient-to-r from-[#B80000] to-red-600 bg-clip-text text-transparent">
                Policy
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-4"
            >
              Your privacy matters to us. Learn how Peerzada Store collects, uses, and protects your personal information.
            </motion.p>

            <motion.div variants={fadeInUp} className="text-sm text-gray-400">
              <p>Last Updated: June 20, 2026</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== TABLE OF CONTENTS ========== */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-lg font-bold text-gray-900 mb-4">
              On This Page
            </motion.h2>
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:text-[#B80000] hover:bg-[#B80000]/5 transition-all duration-200"
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                  {section.title}
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========== PRIVACY CONTENT ========== */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {/* Intro */}
            <motion.div variants={fadeInUp} className="prose prose-gray max-w-none mb-12">
              <p className="text-gray-600 text-lg leading-relaxed">
                At <strong className="text-gray-900">Peerzada Store</strong>, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website or make a purchase from us.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By using our website and services, you agree to the collection and use of information in accordance with this policy. If you do not agree with any part of this policy, please do not use our website or services.
              </p>
            </motion.div>

            {/* Sections */}
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                variants={fadeInUp}
                custom={index}
                className="mb-12 scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-[#B80000] to-red-600 rounded-full" />
                  {section.title}
                </h2>
                <div className="pl-4 sm:pl-6 text-gray-600 leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ========== SUMMARY BOX ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(184,0,0,0.15),transparent_50%)]" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-[#B80000]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Our Commitment to You
              </h3>
              <p className="text-gray-300 mb-6">
                We value your trust and are dedicated to protecting your privacy. If you ever have any concerns or questions about your data, please reach out to us directly. We are here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:info@peerzada.store"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B80000] to-red-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  Email Us
                </a>
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Continue Shopping
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
