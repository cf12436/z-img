'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Locale } from '@/i18n/locales';
import { translations } from '@/i18n/translations';

export default function PrivacyPage() {
  const params = useParams();
  const locale = (params.locale as Locale) || 'en';
  const t = translations[locale] || translations.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-gray-300">
            Last updated: January 1, 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
            <p className="text-gray-300">
              Welcome to Z-Image Free ("we," "our," or "us"). We are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
              AI image generation service at z-img.pics.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
            <p className="text-gray-300">
              <strong>We do not collect personal information.</strong> Our service is designed to be used without 
              registration or login. We do not require you to provide any personal data such as name, email, 
              or payment information.
            </p>
            <p className="text-gray-300">
              <strong>Image Data:</strong> We do not store any images you generate. All generated images are 
              delivered directly to your browser and cached locally on your device for up to 7 days. 
              Our servers do not retain copies of your creations.
            </p>
            <p className="text-gray-300">
              <strong>Analytics:</strong> We use Google Analytics to collect anonymous usage data such as page views, 
              browser type, and general geographic location. This helps us improve our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. How We Use Information</h2>
            <p className="text-gray-300">
              The anonymous analytics data we collect is used solely to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Understand how users interact with our service</li>
              <li>Improve the performance and user experience</li>
              <li>Monitor and prevent technical issues</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Data Storage and Security</h2>
            <p className="text-gray-300">
              Since we do not collect personal data or store your generated images, there is minimal data 
              security risk. Your images are stored only in your browser's local storage and are automatically 
              deleted after 7 days.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Third-Party Services</h2>
            <p className="text-gray-300">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Google Analytics:</strong> For anonymous usage statistics</li>
              <li><strong>Pollinations AI:</strong> For image generation API</li>
            </ul>
            <p className="text-gray-300">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">6. Cookies</h2>
            <p className="text-gray-300">
              We use minimal cookies for:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Remembering your language preference</li>
              <li>Google Analytics tracking (anonymous)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">7. Children's Privacy</h2>
            <p className="text-gray-300">
              Our service is not directed to children under 13. We do not knowingly collect information 
              from children under 13.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">8. Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">9. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-purple-400">
              <a href="mailto:support@z-img.pics" className="hover:text-purple-300">
                support@z-img.pics
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
