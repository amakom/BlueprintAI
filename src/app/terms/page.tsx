import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Terms of Service',
  description: 'BlueprintAI Terms of Service and User Agreement',
};

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-navy mb-8">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-navy max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-navy mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using BlueprintAI (&quot;Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Service. We reserve the right to
              update these terms at any time, and your continued use of the Service constitutes acceptance
              of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed">
              BlueprintAI is an AI-powered project planning platform that helps users create project blueprints,
              user flows, technical specifications, and collaborate with team members. The Service includes
              web-based tools, AI generation features, and collaboration capabilities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">3. User Accounts</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">4. Subscription and Payments</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              BlueprintAI offers free and paid subscription plans. By subscribing to a paid plan:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>You authorize us to charge your payment method on a recurring basis</li>
              <li>Subscription fees are non-refundable except as required by law</li>
              <li>You may cancel your subscription at any time through your account settings</li>
              <li>Downgrading may result in loss of access to certain features or data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">5. Acceptable Use</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Transmit malicious code, spam, or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Use the AI features to generate illegal, harmful, or misleading content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              The Service and its original content, features, and functionality are owned by BlueprintAI
              and are protected by international copyright, trademark, and other intellectual property laws.
              You retain ownership of the content you create using our Service, but grant us a license to
              host, display, and process that content as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">7. AI-Generated Content</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Service uses artificial intelligence to generate content. You acknowledge that AI-generated
              content may not always be accurate, complete, or suitable for your purposes. You are responsible
              for reviewing and verifying any AI-generated content before use. We do not guarantee the accuracy
              or reliability of AI-generated outputs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, BlueprintAI shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other
              intangible losses resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">9. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without prior
              notice or liability, for any reason, including breach of these Terms. Upon termination, your
              right to use the Service will cease immediately. You may export your data before termination
              where the functionality is available.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy mb-4">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@blueprintai.dev" className="text-cyan hover:underline">
                legal@blueprintai.dev
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
