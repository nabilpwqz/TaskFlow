// Card Component
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`rounded-card border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 ${className}`}
    >
      {children}
    </div>
  );
}

// Button Component
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary hover:bg-amber-700 text-white',
    secondary: 'bg-secondary hover:bg-emerald-700 text-white',
    outline: 'border-2 border-primary bg-white text-primary hover:bg-amber-50 dark:border-amber-400 dark:bg-slate-800 dark:text-amber-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`rounded-btn font-semibold transition-all disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? '...' : children}
    </button>
  );
}

// Badge Component
interface BadgeProps {
  variant?: 'orange' | 'green' | 'amber';
  children: React.ReactNode;
}

export function Badge({ variant = 'orange', children }: BadgeProps) {
  const variants = {
    orange: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100',
    green: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100',
    amber: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100',
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

// Skeleton Component
export function SkeletonCard() {
  return (
    <div className="rounded-card overflow-hidden bg-white dark:bg-slate-800">
      <div className="h-48 animate-pulse bg-gray-200 dark:bg-slate-700" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
      </div>
    </div>
  );
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-semibold dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-btn border border-gray-300 px-4 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white ${className} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-semibold dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea
        className={`w-full rounded-btn border border-gray-300 px-4 py-2 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white ${className} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Toast Component
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex items-center gap-3 rounded-btn px-4 py-3 text-white shadow-lg ${colors[type]}`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold">
        ×
      </button>
    </div>
  );
}
