// src/types/express.d.ts

import { IUser } from './admin.type'; // Adjust the import path as necessary

declare global {
    namespace Express {
        interface Request {
          user?: Omit<IUser, 'password'>; // user will not have password field
        }
    }
}
