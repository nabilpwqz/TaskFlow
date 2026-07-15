// Add Task Page (Protected)
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Input, Textarea, Button, Card, Toast } from '@/components/UI';

export default function AddTaskPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { createTask } = useTasks();

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    price: '',
    category: 'Web Development',
    imageUrl: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="mb-4">Please log in to post a task.</p>
        <Button onClick={() => router.push('/login')}>Go to Login</Button>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.title || !formData.shortDesc || !formData.fullDesc || !formData.price) {
      setError('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    try {
      await createTask({
        ...formData,
        price: parseInt(formData.price),
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop',
      });
      setShowToast(true);
      setTimeout(() => router.push('/tasks/manage'), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Post a New Task</h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <Input
            label="Short Description *"
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            maxLength={300}
            required
          />
          <Textarea
            label="Full Description *"
            name="fullDesc"
            rows={5}
            value={formData.fullDesc}
            onChange={handleChange}
            required
          />
          <Input
            label="Price (USD) *"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            min="1"
            required
          />
          <div>
            <label className="mb-2 block text-sm font-semibold">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-btn border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
            >
              <option value="Web Development">Web Development</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Content Writing">Content Writing</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input
            label="Image URL"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://..."
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Submit Task
          </Button>
        </form>
      </Card>

      {showToast && (
        <Toast message="Task posted successfully!" type="success" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
