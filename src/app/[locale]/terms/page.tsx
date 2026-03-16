'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Locale } from '@/i18n/locales';
import { translations } from '@/i18n/translations';

export default function TermsPage() {
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

        <h1 className="text-4xl font-bold mb-8 gradient-text">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-gray-300">
            Last updated: January 1, 2025
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="text-gray-300">
              By accessing and using Z-Image Free ("Service") at z-img.pics, you accept and agree to be bound 
              by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">2. Description of Service</h2>
            <p className="text-gray-300">
              Z-Image Free is a free AI-powered image generation service that allows users to create images 
              from text prompts. The Service is provided "as is" without any guarantees or warranties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">3. User Responsibilities</h2>
            <p className="text-gray-300">
              By using our Service, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Use the Service only for lawful purposes</li>
              <li>Not generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, 
                  vulgar, obscene, or otherwise objectionable</li>
              <li>Not generate content that infringes on intellectual property rights of others</li>
              <li>Not attempt to reverse engineer, hack, or disrupt the Service</li>
              <li>Not use the Service to generate content depicting minors in inappropriate situations</li>
              <li>Not use automated systems to abuse the Service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">4. Intellectual Property</h2>
            <p className="text-gray-300">
              <strong>Your Content:</strong> You retain ownership of the images you generate using our Service. 
              You are free to use, modify, and distribute your generated images as you see fit.
            </p>
            <p className="text-gray-300">
              <strong>Our Service:</strong> The Z-Image Free website, branding, and underlying technology 
              remain our intellectual property.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">5. Disclaimer of Warranties</h2>
            <p className="text-gray-300">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-gray-300">
              We do not guarantee that:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>The Service will be uninterrupted or error-free</li>
              <li>The results will meet your requirements</li>
              <li>The quality of generated images will be satisfactory</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">6. Limitation of Liability</h2>
            <p className="text-gray-300">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER 
              INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">7. Service Modifications</h2>
            <p className="text-gray-300">
              We reserve the right to modify, suspend, or discontinue the Service at any time without notice. 
              We may also impose limits on certain features or restrict access to parts of the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">8. Termination</h2>
            <p className="text-gray-300">
              We may terminate or suspend your access to the Service immediately, without prior notice, 
              for any reason, including if you breach these Terms of Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">9. Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to modify these Terms at any time. We will notify users of any material 
              changes by updating the "Last updated" date. Your continued use of the Service after such 
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">10. Governing Law</h2>
            <p className="text-gray-300">
              These Terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">11. Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms of Service, please contact us at:
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
