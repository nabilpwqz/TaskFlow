import mongoose from 'mongoose';
import { IUserDocument } from '../types';
export interface IUserDocumentMethods {
    comparePassword(password: string): Promise<boolean>;
}
export type IUserDocumentWithMethods = IUserDocument & IUserDocumentMethods;
export declare const User: mongoose.Model<IUserDocumentWithMethods, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocumentWithMethods> & IUserDocument & IUserDocumentMethods & {
    _id: mongoose.Types.ObjectId;
}, any>;
export type { IUserDocumentWithMethods as IUserDocument };
//# sourceMappingURL=User.d.ts.map