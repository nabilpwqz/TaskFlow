import { ITaskDocument } from '../models/Task';
import { CreateTaskInput, UpdateTaskInput } from '../utils/validation';
export interface ITaskFilters {
    search?: string;
    category?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating';
    page?: number;
    limit?: number;
}
export declare class TaskService {
    getAllTasks(filters?: ITaskFilters): Promise<{
        items: Omit<import("mongoose").Document<unknown, {}, ITaskDocument> & ITaskDocument & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTaskById(taskId: string): Promise<ITaskDocument | null>;
    createTask(userId: string, data: CreateTaskInput): Promise<ITaskDocument>;
    updateTask(taskId: string, userId: string, data: UpdateTaskInput): Promise<ITaskDocument>;
    deleteTask(taskId: string, userId: string): Promise<void>;
    getUserTasks(userId: string): Promise<ITaskDocument[]>;
}
export declare const taskService: TaskService;
//# sourceMappingURL=TaskService.d.ts.map