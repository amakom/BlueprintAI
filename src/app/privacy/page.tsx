import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Privacy Policy',
  description: 'BlueprintAI Privacy Policy - How we collect, use, and protect your data',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cloud">
      <header className="bg-white border-b border-border py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Image src="/icon.svg" alt="BlueprintAI" width={32} height={32} className="rounded-md" />
            <span className="text-xl font-bold text-navy">BlueprintAI</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-navy">Back to Home</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-navy mb-8">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-navy max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-navy mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              BlueprintAI (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our
              AI-powered project planning platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-navy mb-2 mt-4">Personal Information</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Name and email address</li>
              <li>Password (stored in encrypted form)</li>
              <li>Payment information (processed securely by our payment provider)</li>
              <li>Team and organization information</li>
            </ul>

            <h3 className="text-lg font-semibold text-navy mb-2 mt-4">Usage Data</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and features used</li>
              <li>Time and date of visits</li>
              <li>AI generation requests and usage patterns</li>
            </ul>

            <h3 className="text-lg font-semibold text-navy mb-2 mt-4">Content Data</h3>
            <p className="text-gray-600 leading-relaxed">
              We store the content you create, including projects, documents, canvas designs,
              AI-generated content, and collaboration data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send billing information</li>
              <li>Send important updates about your account or the Service</li>
              <li>Respond to customer support requests</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">4. AI and Data Processing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our Service uses artificial intelligence to generate content. When you use AI features:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Your prompts and inputs are sent to our AI providers (OpenAI) for processing</li>
              <li>AI-generated outputs are stored in your account</li>
              <li>We do not use your content to train AI models without explicit consent</li>
              <li>AI processing is subject to our providers&apos; privacy policies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">5. Data Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Third parties that help us operate our Service (hosting, payments, email)</li>
              <li><strong>Team Members:</strong> Other users in your team or organization</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">6. Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures including encryption in transit (HTTPS),
              encrypted password storage, secure authentication tokens, and regular security audits.
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">7. Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide services.
              When you delete your account, we will delete your personal data within 30 days, except where
              we are required to retain it for legal or legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">8. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">9. Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use essential cookies to maintain your session and preferences. We may also use
              analytics cookies to understand how users interact with our Service. You can control
              cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">10. Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Service is not intended for users under 16 years of age. We do not knowingly collect
              personal information from children. If you believe we have collected information from a
              child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">11. International Transfers</h2>
            <p className="text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place to protect your data in accordance with
              this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">12. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by email or through the Service. Your continued use after changes constitutes
              acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">13. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Privacy Policy or wish to exercise your rights, contact us at{' '}
              <a href="mailto:privacy@blueprintai.dev" className="text-cyan hover:underline">
                privacy@blueprintai.dev
              </a>
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap gap-4 justify-center text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-navy">Privacy Policy</Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-navy">Terms of Service</Link>
          <span>|</span>
          <Link href="/" className="hover:text-navy">Home</Link>
        </div>
      </footer>
    </div>
  );
}
