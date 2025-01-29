// declare namespace Express {
//   export interface Request {
//     user?: { userId: number };
//   }
// }
// src/types/express.d.ts
import { User } from "./models/User"; // Adjust the import path as needed

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}
