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
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <>
        <p className="mb-4">
          By accessing or using Peerzada Store (&ldquo;the Store,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.
        </p>
        <p className="text-gray-600">
          We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms. We encourage you to review this page periodically.
        </p>
      </>
    ),
  },
  {
    id: 'account',
    title: '2. Account Registration & Responsibilities',
    content: (
      <>
        <p className="mb-4">When you create an account on Peerzada Store, you agree to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li>Provide accurate, current, and complete information during registration.</li>
          <li>Maintain and update your account information to keep it accurate.</li>
          <li>Keep your password secure and confidential.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
          <li>Accept responsibility for all activities that occur under your account.</li>
        </ul>
        <p className="text-gray-600">
          You must be at least 13 years of age to use our services. If you are under 18, you may only use our services with the involvement of a parent or guardian.
        </p>
      </>
    ),
  },
  {
    id: 'orders',
    title: '3. Orders & Payments',
    content: (
      <>
        <p className="mb-4">By placing an order on Peerzada Store, you agree to the following:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li><strong className="text-gray-900">Order Acceptance:</strong> We reserve the right to accept or decline any order for any reason, including product availability, pricing errors, or suspected fraud.</li>
          <li><strong className="text-gray-900">Pricing:</strong> All prices are listed in Pakistani Rupees (PKR) and are subject to change without notice. The price at the time of order placement will be honored.</li>
          <li><strong className="text-gray-900">Payment:</strong> Payment is due at the time of order. We accept payments through our secure third-party payment processors. By providing payment information, you represent that you are authorized to use the payment method.</li>
          <li><strong className="text-gray-900">Order Confirmation:</strong> A confirmation message will be sent to your provided contact information. Please review your order details carefully upon receipt.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'shipping',
    title: '4. Shipping & Delivery',
    content: (
      <>
        <p className="mb-4">Our shipping and delivery policies are as follows:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li><strong className="text-gray-900">Delivery Area:</strong> We currently deliver to addresses across Pakistan.</li>
          <li><strong className="text-gray-900">Processing Time:</strong> Orders are typically processed within 1-2 business days after payment confirmation.</li>
          <li><strong className="text-gray-900">Delivery Time:</strong> Estimated delivery is 3-7 business days depending on your location.</li>
          <li><strong className="text-gray-900">Shipping Charges:</strong> Free shipping is offered on eligible orders. Standard shipping charges may apply for other orders.</li>
          <li><strong className="text-gray-900">Risk of Loss:</strong> All items purchased from Peerzada Store are made pursuant to a shipment contract. The risk of loss and title for such items pass to you upon delivery to the carrier.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'returns',
    title: '5. Returns & Refunds',
    content: (
      <>
        <p className="mb-4">Our return and refund policy:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li><strong className="text-gray-900">Return Window:</strong> You may return unused and unopened products within 7 days of delivery for a full refund or exchange.</li>
          <li><strong className="text-gray-900">Condition:</strong> Products must be returned in their original packaging and condition. Items that are damaged, used, or missing parts may be subject to a restocking fee.</li>
          <li><strong className="text-gray-900">Refund Processing:</strong> Refunds will be processed within 5-7 business days after we receive and inspect the returned item.</li>
          <li><strong className="text-gray-900">Non-Returnable Items:</strong> Customized or personalized items cannot be returned unless there is a manufacturing defect.</li>
          <li><strong className="text-gray-900">Shipping Costs:</strong> Return shipping costs are borne by the customer unless the return is due to our error or a defective product.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'conduct',
    title: '6. User Conduct & Prohibited Activities',
    content: (
      <>
        <p className="mb-4">You agree not to use our services for any unlawful or prohibited purpose, including:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li>Violating any applicable laws or regulations.</li>
          <li>Impersonating any person or entity or misrepresenting your affiliation.</li>
          <li>Interfering with or disrupting our services, servers, or networks.</li>
          <li>Attempting to gain unauthorized access to any part of our systems.</li>
          <li>Uploading or transmitting viruses, malware, or any malicious code.</li>
          <li>Engaging in any activity that could harm minors or exploit their data.</li>
          <li>Using our platform for any fraudulent or deceptive purpose.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual',
    title: '7. Intellectual Property Rights',
    content: (
      <>
        <p className="mb-4">
          All content on Peerzada Store, including but not limited to text, graphics, logos, images, product descriptions, software, and code, is the property of Peerzada Store or its content suppliers and is protected by applicable intellectual property laws.
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li>You may not reproduce, distribute, modify, or create derivative works without our prior written consent.</li>
          <li>The Peerzada Store name, logo, and related marks are our trademarks and may not be used without permission.</li>
          <li>Unauthorized use of our intellectual property may result in legal action.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'limitation',
    title: '8. Limitation of Liability',
    content: (
      <>
        <p className="mb-4">
          To the fullest extent permitted by law, Peerzada Store and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
        </p>
        <p className="mb-4 text-gray-600">
          Our total liability for any claim arising from your use of our services is limited to the amount you paid for the specific product or service giving rise to the claim.
        </p>
        <p className="text-gray-600">
          We do not warrant that our services will be uninterrupted, timely, secure, or error-free. We are not responsible for any delays, delivery failures, or damages caused by events beyond our reasonable control.
        </p>
      </>
    ),
  },
  {
    id: 'indemnification',
    title: '9. Indemnification',
    content: (
      <>
        <p className="mb-4">
          You agree to indemnify, defend, and hold harmless Peerzada Store, its officers, directors, employees, agents, and suppliers from any claims, losses, damages, liabilities, and expenses arising from:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-600">
          <li>Your use or misuse of our services.</li>
          <li>Your violation of these Terms of Service.</li>
          <li>Your violation of any third-party rights, including intellectual property rights.</li>
          <li>Any content you submit or transmit through our services.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'termination',
    title: '10. Termination',
    content: (
      <>
        <p className="mb-4">
          We reserve the right to suspend or terminate your account and access to our services at any time, without prior notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.
        </p>
        <p className="text-gray-600">
          Upon termination, your right to use our services will immediately cease. Provisions of these terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
        </p>
      </>
    ),
  },
  {
    id: 'governing',
    title: '11. Governing Law',
    content: (
      <>
        <p className="mb-4">
          These Terms of Service shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan. Any disputes arising from these terms shall be resolved in the courts of Pakistan.
        </p>
        <p className="text-gray-600">
          We make no representation that our services are appropriate or available for use in locations outside Pakistan. Users who access our services from outside Pakistan do so at their own risk and are responsible for compliance with local laws.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    title: '12. Contact Information',
    content: (
      <>
        <p className="mb-4">
          If you have any questions, concerns, or requests regarding these Terms of Service, please contact us:
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

export default function TermsPage() {
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
              Terms of{' '}
              <span className="bg-gradient-to-r from-[#B80000] to-red-600 bg-clip-text text-transparent">
                Service
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-4"
            >
              These terms govern your use of Peerzada Store. Please read them carefully before using our services.
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

      {/* ========== TERMS CONTENT ========== */}
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
                Welcome to <strong className="text-gray-900">Peerzada Store</strong>. These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of our website, products, and services. By accessing or using our platform, you enter into a binding agreement with us.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Please take the time to read these terms carefully. If you have any questions, please contact us before using our services.
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                Questions?
              </h3>
              <p className="text-gray-300 mb-6">
                If you have any questions about these terms, please don&apos;t hesitate to reach out. We&apos;re here to help.
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
                  Start Shopping
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
