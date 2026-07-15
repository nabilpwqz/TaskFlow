// About Page
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-4xl font-bold">About TaskFlow</h1>
      <p className="mb-6 text-lg text-gray-600 dark:text-slate-300">
        TaskFlow was founded in 2024 to connect businesses with top freelance talent worldwide.
        Our mission is to make it easy for companies to find qualified professionals and for
        freelancers to find meaningful work.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            icon: '🌍',
            title: 'Global Reach',
            desc: 'Freelancers from 120+ countries',
          },
          {
            icon: '🛡️',
            title: 'Trust & Safety',
            desc: 'Verified profiles & secure escrow',
          },
          {
            icon: '🚀',
            title: 'Fast Results',
            desc: 'Avg task completed in 3 days',
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-card border border-gray-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-3 text-5xl">{item.icon}</div>
            <h3 className="mb-2 font-bold">{item.title}</h3>
            <p className="text-sm text-gray-600 dark:text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
