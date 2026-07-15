import mongoose from 'mongoose';
import { ITaskDocument } from '../types';
export declare const Task: mongoose.Model<ITaskDocument, {}, {}, {}, mongoose.Document<unknown, {}, ITaskDocument> & ITaskDocument & {
    _id: mongoose.Types.ObjectId;
}, any>;
export type { ITaskDocument };
//# sourceMappingURL=Task.d.ts.map