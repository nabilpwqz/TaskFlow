// Task Details Page
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { ITask } from '@/types';
import { Card, Badge, Button } from '@/components/UI';
import Link from 'next/link';

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getTaskById } = useTasks();
  const { user } = useAuth();
  const [task, setTask] = useState<ITask | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await getTaskById(params.id as string);
        setTask(data);
      } catch (error) {
        console.error('Failed to load task:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTask();
  }, [params.id]);

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-12 text-center">Loading...</div>;
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Task Not Found</h1>
        <Link href="/tasks">
          <Button>← Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  const stars = '⭐'.repeat(Math.round(task.rating || 0));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/tasks" className="mb-6 inline-block text-primary hover:underline dark:text-amber-400">
        ← Back to Tasks
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="h-96 rounded-card bg-gray-200 dark:bg-slate-700" />

        {/* Details */}
        <div>
          <Badge>{task.category}</Badge>
          <h1 className="mb-2 mt-4 text-3xl font-bold">{task.title}</h1>
          <p className="mb-4 text-gray-600 dark:text-slate-400">{task.shortDesc}</p>

          <div className="mb-6 flex items-center justify-between">
            <span className="text-4xl font-extrabold text-primary dark:text-amber-400">
              ${task.price.toLocaleString()}
            </span>
            <span className="text-lg">
              {stars} {task.rating} ({task.reviewCount} reviews)
            </span>
          </div>

          <hr className="my-4 dark:border-slate-600" />

          <p className="mb-2 text-sm text-gray-600 dark:text-slate-400">
            Posted by <strong>{task.owner?.name || 'Unknown'}</strong>
          </p>
          <p className="mb-6 text-sm text-gray-600 dark:text-slate-400">
            Status: <Badge variant="green">{task.status}</Badge>
          </p>

          {user ? (
            <Link href={`/tasks/${task._id}/apply`}>
              <Button className="w-full">Apply Now</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="w-full">Login to Apply</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Full Description */}
      <Card className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Full Description</h2>
        <p className="whitespace-pre-wrap text-gray-700 dark:text-slate-300">{task.fullDesc}</p>
      </Card>

      {/* Reviews */}
      <Card className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Reviews ({task.reviews?.length || 0})</h2>
        {task.reviews && task.reviews.length > 0 ? (
          <div className="space-y-4">
            {task.reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-4 dark:border-slate-700">
                <div className="mb-2 flex items-center justify-between">
                  <strong className="dark:text-white">User</strong>
                  <span className="text-sm text-gray-600 dark:text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-2">{'⭐'.repeat(review.rating)}</div>
                <p className="text-gray-700 dark:text-slate-300">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-slate-400">No reviews yet.</p>
        )}
      </Card>
    </div>
  );
}
