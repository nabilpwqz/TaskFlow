// Contact Page
'use client';

import { useState } from 'react';
import { Input, Textarea, Button, Card, Toast } from '@/components/UI';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 text-3xl font-bold">Contact Us</h1>
      <p className="mb-8 text-gray-600 dark:text-slate-400">
        Have questions? We'd love to hear from you.
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Textarea
            label="Message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </Card>

      {showToast && (
        <Toast message="Message sent successfully!" type="success" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
