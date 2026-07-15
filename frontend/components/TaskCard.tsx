// Task Card Component
'use client';

import { ITask } from '@/types';
import { Badge } from './UI';
import Link from 'next/link';
import Image from 'next/image';

interface TaskCardProps {
  task: ITask;
}

export function TaskCard({ task }: TaskCardProps) {
  const stars = '⭐'.repeat(Math.round(task.rating || 0));

  return (
    <Link href={`/tasks/${task._id}`}>
      <div className="group flex flex-col overflow-hidden rounded-card border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-slate-700">
          <Image
            src={task.imageUrl}
            alt={task.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop';
            }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <Badge>{task.category}</Badge>
          <h3 className="line-clamp-2 text-lg font-semibold dark:text-white">{task.title}</h3>
          <p className="line-clamp-2 text-sm text-gray-600 dark:text-slate-400">{task.shortDesc}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary dark:text-amber-400">
              ${task.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600 dark:text-slate-400">
              {stars} {task.rating} ({task.reviewCount})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Task Card Grid
interface TaskGridProps {
  tasks: ITask[];
  isLoading?: boolean;
}

export function TaskGrid({ tasks, isLoading }: TaskGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-card bg-gray-200 dark:bg-slate-700"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-gray-500 dark:text-slate-400">No tasks found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
