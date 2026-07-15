// Tasks Hook
'use client';

import { useState, useCallback } from 'react';
import apiClient from '@/lib/api';
import { ITask, ITasksResponse, ITaskFilters } from '@/types';

export function useTasks() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const getTasks = useCallback(async (filters: Partial<ITaskFilters> = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await apiClient.get<ITasksResponse>(`/tasks?${params}`);
      setTasks(response.data.items);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.page);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch tasks';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTaskById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data.task;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch task';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: Partial<ITask>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/tasks', data);
      return response.data.task;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create task';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/tasks/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete task';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/tasks/user/my-tasks');
      setTasks(response.data.tasks);
      return response.data.tasks;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to fetch your tasks';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    tasks,
    isLoading,
    error,
    totalPages,
    currentPage,
    getTasks,
    getTaskById,
    createTask,
    deleteTask,
    getUserTasks,
  };
}
