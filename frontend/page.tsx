// Home Page
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/UI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Jan', tasks: 1200, users: 5000 },
  { month: 'Feb', tasks: 1800, users: 7000 },
  { month: 'Mar', tasks: 2500, users: 10000 },
  { month: 'Apr', tasks: 3000, users: 13000 },
  { month: 'May', tasks: 3800, users: 17000 },
  { month: 'Jun', tasks: 4500, users: 21000 },
  { month: 'Jul', tasks: 5200, users: 26000 },
  { month: 'Aug', tasks: 6100, users: 30000 },
  { month: 'Sep', tasks: 7000, users: 35000 },
  { month: 'Oct', tasks: 8200, users: 40000 },
  { month: 'Nov', tasks: 9500, users: 46000 },
  { month: 'Dec', tasks: 11200, users: 52000 },
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 px-4 py-20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
                🏆 Trusted by 50,000+ businesses
              </div>
              <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
                Find Expert Freelancers for{' '}
                <span className="text-primary dark:text-amber-400">Any Project</span>
              </h1>
              <p className="mb-8 text-lg text-gray-600 dark:text-slate-300">
                TaskFlow connects you with top-tier freelance professionals across development, design,
                writing, and marketing.
              </p>
              <div className="flex gap-3 justify-center md:justify-start flex-wrap">
                <Link href="/tasks">
                  <Button size="lg" className="px-8">
                    Browse Tasks
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="px-8">
                    Join Free
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-80 w-full rounded-2xl bg-gradient-to-br from-primary to-amber-600 shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { label: 'Registered Users', value: '50K+' },
              { label: 'Completed Tasks', value: '12K+' },
              { label: 'Total Earnings', value: '$8M+' },
              { label: 'Satisfaction Rate', value: '98%' },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <div className="text-4xl font-extrabold text-primary dark:text-amber-400">
                  {stat.value}
                </div>
                <p className="mt-2 text-gray-600 dark:text-slate-400">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Section */}
      {isClient && (
        <section className="px-4 py-12 bg-white dark:bg-slate-800">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-2 text-center text-3xl font-bold">Platform Growth</h2>
            <p className="mb-8 text-center text-gray-600 dark:text-slate-400">
              Our marketplace continues to expand rapidly
            </p>
            <Card>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="tasks" stroke="#D97706" strokeWidth={2} />
                  <Line type="monotone" dataKey="users" stroke="#059669" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 py-12 bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-2 text-center text-3xl font-bold">Why Choose TaskFlow</h2>
          <p className="mb-10 text-center text-gray-600 dark:text-slate-400">
            Built for both clients and freelancers
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: '🔍', title: 'Smart Matching', desc: 'Our algorithm connects you with qualified professionals.' },
              { icon: '💳', title: 'Secure Payments', desc: 'Funds held securely until you approve the work.' },
              { icon: '⚡', title: 'Rapid Turnaround', desc: 'Most tasks receive proposals within hours.' },
            ].map((feature) => (
              <Card key={feature.title} className="text-center">
                <div className="mb-4 text-5xl">{feature.icon}</div>
                <h3 className="mb-2 font-bold text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-center text-3xl font-bold">Popular Categories</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { icon: '💻', name: 'Web Development' },
              { icon: '🎨', name: 'Graphic Design' },
              { icon: '✍️', name: 'Content Writing' },
              { icon: '📈', name: 'Digital Marketing' },
            ].map((cat) => (
              <Link key={cat.name} href={`/tasks?category=${encodeURIComponent(cat.name)}`}>
                <Card className="cursor-pointer text-center transition-transform hover:scale-105">
                  <div className="mb-3 text-4xl">{cat.icon}</div>
                  <p className="font-semibold">{cat.name}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-12 bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-center text-3xl font-bold">What Our Users Say</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                initials: 'JD',
                name: 'James Donovan',
                role: 'Startup Founder',
                text: 'TaskFlow helped me find an amazing developer. Quality exceeded expectations.',
              },
              {
                initials: 'SC',
                name: 'Sarah Chen',
                role: 'UX Designer',
                text: 'As a freelancer, TaskFlow provides consistent, high-quality leads.',
              },
              {
                initials: 'MR',
                name: 'Michael Roberts',
                role: 'E-commerce Owner',
                text: 'The escrow system gives me peace of mind.',
              },
            ].map((testimonial) => (
              <Card key={testimonial.name}>
                <p className="mb-4 italic text-gray-600 dark:text-slate-300">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                    {testimonial.initials}
                  </div>
                  <div>
                    <strong>{testimonial.name}</strong>
                    <p className="text-xs text-gray-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-2">⭐⭐⭐⭐⭐</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-amber-700 px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
          <p className="mb-8 text-lg text-amber-100">Join thousands already using TaskFlow.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button variant="primary" size="lg" className="px-8 bg-amber-400 text-gray-900 hover:bg-amber-300">
                Create Free Account
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="outline" size="lg" className="border-white px-8 text-white hover:bg-white hover:text-primary">
                Explore Tasks
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
