// Navigation Component
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <span className="text-3xl">⚡</span>
          <span className="text-primary">TaskFlow</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden gap-8 md:flex">
          <Link href="/" className="hover:text-primary dark:hover:text-amber-400">
            Home
          </Link>
          <Link href="/tasks" className="hover:text-primary dark:hover:text-amber-400">
            Explore
          </Link>
          <Link href="/about" className="hover:text-primary dark:hover:text-amber-400">
            About
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-slate-700"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link href="/tasks/add" className="btn btn-secondary btn-sm">
                + Post Task
              </Link>
              <Link href="/tasks/manage" className="text-sm hover:text-primary">
                My Tasks
              </Link>
              <span className="text-sm font-semibold">{user.email}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-3">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <Link href="/tasks" className="hover:text-primary">
              Explore
            </Link>
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/tasks/add" className="btn btn-secondary btn-sm">
                  + Post Task
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
