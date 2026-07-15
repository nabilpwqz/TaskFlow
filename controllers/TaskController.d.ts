import { Request, Response, NextFunction } from 'express';
export declare class TaskController {
    getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void>;
    getTaskById(req: Request, res: Response, next: NextFunction): Promise<void>;
    createTask(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateTask(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteTask(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUserTasks(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const taskController: TaskController;
//# sourceMappingURL=TaskController.d.ts.map