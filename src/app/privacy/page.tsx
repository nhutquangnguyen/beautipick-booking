export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-gray">
          <p className="text-gray-600 mb-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h2>
            <p className="text-gray-600">
              BeautiPick ("we", "our", or "us") respects your privacy and is committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website
              and tell you about your privacy rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
            <p className="text-gray-600 mb-2">We may collect the following information:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Name and contact information including email address</li>
              <li>Business information such as salon name and services</li>
              <li>Profile information and photos you choose to upload</li>
              <li>Booking and appointment information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
            <p className="text-gray-600 mb-2">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Provide and maintain our service</li>
              <li>Process bookings and appointments</li>
              <li>Send you important updates about our service</li>
              <li>Improve our platform and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information.
              Your data is stored securely and we use industry-standard encryption.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h2>
            <p className="text-gray-600">
              We use third-party services including Google OAuth for authentication and Supabase for data storage.
              These services have their own privacy policies governing the use of your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Your Rights</h2>
            <p className="text-gray-600">
              You have the right to access, update, or delete your personal information at any time.
              You can manage your data through your account settings or by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at nguyenquang.btr@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
