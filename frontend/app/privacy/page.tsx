// Privacy Policy Page
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <div className="space-y-6 text-gray-700 dark:text-slate-300">
        <section>
          <h2 className="mb-3 text-xl font-bold">Effective Date: January 1, 2026</h2>
          <p>
            We are committed to protecting your privacy. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you visit our website.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold">Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may
            collect on the site includes:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Personal Data (name, email address, phone number, etc.)</li>
            <li>Financial Data (billing information, payment methods, etc.)</li>
            <li>Data Generated (browsing history, IP address, device information, etc.)</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold">Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth,
            efficient, and customized experience. Specifically, we may use information collected
            about you via the site to:
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>Generate a personal profile about you</li>
            <li>Increase the efficiency and operation of the site</li>
            <li>Monitor and analyze usage and trends to improve your experience</li>
            <li>Notify you of updates to the site</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
