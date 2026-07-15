// Tasks Listing Page
'use client';

import { useEffect, useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskGrid } from '@/components/TaskCard';
import { Input, Button } from '@/components/UI';

export default function TasksPage() {
  const { tasks, isLoading, getTasks, totalPages, currentPage } = useTasks();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getTasks({ search, category, sort, page, limit: 8 });
  }, [search, category, sort, page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value as 'newest' | 'price-asc' | 'price-desc' | 'rating');
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Explore Tasks</h1>
        <p className="text-gray-600 dark:text-slate-400">Find the perfect freelance opportunity</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="rounded-btn border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="all">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Content Writing">Content Writing</option>
          <option value="Digital Marketing">Digital Marketing</option>
        </select>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="rounded-btn border border-gray-300 px-4 py-2 dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low-High</option>
          <option value="price-desc">Price: High-Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Task Grid */}
      <TaskGrid tasks={tasks} isLoading={isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? 'primary' : 'outline'}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
