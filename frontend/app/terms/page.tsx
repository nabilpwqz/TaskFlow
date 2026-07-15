// Terms of Service Page
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>
      <div className="space-y-6 text-gray-700 dark:text-slate-300">
        <section>
          <h2 className="mb-3 text-xl font-bold">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms
            and provision of this agreement. If you do not agree to abide by the above, please do
            not use this service.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold">2. User Responsibilities</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their account information
            and passwords and for restricting access to their computer. Users agree to accept
            responsibility for all activities that occur under their account or password.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold">3. Limitation of Liability</h2>
          <p>
            In no event shall TaskFlow be liable for indirect, incidental, special, consequential,
            or punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-bold">4. Modifications</h2>
          <p>
            TaskFlow reserves the right to modify these terms at any time. Your continued use of
            this site following the posting of revised Terms means that you accept and agree to
            the changes.
          </p>
        </section>
      </div>
    </div>
  );
}
