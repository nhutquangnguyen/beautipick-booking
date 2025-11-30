export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-gray">
          <p className="text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Agreement to Terms</h2>
            <p className="text-gray-600">
              By accessing and using BeautiPick, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms,
              you are prohibited from using this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Use of Service</h2>
            <p className="text-gray-600 mb-2">You agree to use BeautiPick only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Use the service in any way that violates any applicable law or regulation</li>
              <li>Impersonate or attempt to impersonate another user or business</li>
              <li>Upload or transmit malicious code or harmful content</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">User Accounts</h2>
            <p className="text-gray-600">
              When you create an account, you must provide accurate and complete information.
              You are responsible for maintaining the confidentiality of your account credentials
              and for all activities that occur under your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Content</h2>
            <p className="text-gray-600">
              You retain all rights to the content you upload to BeautiPick (such as photos, service descriptions, etc.).
              By uploading content, you grant us a license to use, display, and distribute that content
              as part of providing the service to you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Bookings and Appointments</h2>
            <p className="text-gray-600">
              BeautiPick provides a platform for managing bookings and appointments. We are not responsible
              for the actual services provided by businesses using our platform. Any disputes regarding
              services should be resolved directly between the business and their customers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Availability</h2>
            <p className="text-gray-600">
              We strive to keep BeautiPick available at all times, but we do not guarantee uninterrupted access.
              We may modify, suspend, or discontinue any part of the service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Limitation of Liability</h2>
            <p className="text-gray-600">
              BeautiPick is provided "as is" without warranties of any kind. We shall not be liable
              for any indirect, incidental, special, or consequential damages arising out of or
              related to your use of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these Terms of Service at any time. We will notify users
              of any material changes. Your continued use of the service after such changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please contact us at nguyenquang.btr@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
