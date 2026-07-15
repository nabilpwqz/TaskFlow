// Manage Tasks Page (Protected)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { ITask } from '@/types';
import { Button, Card, Toast } from '@/components/UI';
import Link from 'next/link';

export default function ManageTasksPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { getUserTasks, deleteTask } = useTasks();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadTasks();
  }, [isAuthenticated]);

  const loadTasks = async () => {
    try {
      const data = await getUserTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t._id !== taskId));
      setToastMessage('Task deleted successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (isLoading) {
    return <div className="mx-auto max-w-5xl px-4 py-12 text-center">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-bold">My Tasks</h1>
          <p className="text-gray-600 dark:text-slate-400">Manage your posted tasks</p>
        </div>
        <Link href="/tasks/add">
          <Button>+ Post New Task</Button>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <Card className="text-center">
          <p className="mb-4 text-gray-600 dark:text-slate-400">You haven't posted any tasks yet.</p>
          <Link href="/tasks/add">
            <Button>Post Your First Task</Button>
          </Link>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-card border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="p-4 text-left text-sm font-semibold">Task</th>
                <th className="p-4 text-left text-sm font-semibold">Category</th>
                <th className="p-4 text-left text-sm font-semibold">Price</th>
                <th className="p-4 text-left text-sm font-semibold">Status</th>
                <th className="p-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-b border-gray-200 hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-slate-700"
                >
                  <td className="p-4 font-medium">{task.title}</td>
                  <td className="p-4 text-sm">
                    <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-amber-900 dark:bg-amber-900 dark:text-amber-100">
                      {task.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-primary dark:text-amber-400">
                    ${task.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
                      {task.status}
                    </span>
                  </td>
                  <td className="flex gap-2 p-4">
                    <Link href={`/tasks/${task._id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showToast && (
        <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />
      )}
    </div>
  );
}
