// Footer Component
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-slate-800 text-gray-200 transition-colors dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-xl font-bold text-white">
              <span className="text-2xl">⚡</span> TaskFlow
            </h4>
            <p className="text-sm text-gray-400">
              The premier freelance services marketplace connecting talented professionals with
              businesses worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="mb-3 font-semibold text-white">Quick Links</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tasks" className="hover:text-amber-400">
                  🔍 Explore Tasks
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400">
                  ℹ️ About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400">
                  📬 Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400">
                  🔒 Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="mb-3 font-semibold text-white">Categories</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tasks?category=Web%20Development" className="hover:text-amber-400">
                  💻 Web Development
                </Link>
              </li>
              <li>
                <Link href="/tasks?category=Graphic%20Design" className="hover:text-amber-400">
                  🎨 Graphic Design
                </Link>
              </li>
              <li>
                <Link href="/tasks?category=Content%20Writing" className="hover:text-amber-400">
                  ✍️ Content Writing
                </Link>
              </li>
              <li>
                <Link href="/tasks?category=Digital%20Marketing" className="hover:text-amber-400">
                  📈 Digital Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="mb-3 font-semibold text-white">Connect With Us</h5>
            <div className="mb-4 flex gap-4">
              <a href="#" className="hover:text-amber-400">
                𝕏
              </a>
              <a href="#" className="hover:text-amber-400">
                LinkedIn
              </a>
              <a href="#" className="hover:text-amber-400">
                Facebook
              </a>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 hello@taskflow.io</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 San Francisco, CA</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 py-6 text-center text-sm text-gray-500">
          &copy; 2026 TaskFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
