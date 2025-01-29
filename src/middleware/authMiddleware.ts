import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Ensure you have this custom type declaration somewhere in your project
// If you haven't done it yet, add it to src/types/express/index.d.ts
declare namespace Express {
  export interface Request {
    user?: { userId: number };
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  const JWT_SECRET = process.env.JWT_SECRET as string;

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }

    // TypeScript doesn't know that decoded is an object, so we need to explicitly cast it
    if (decoded && typeof decoded !== 'string') {
      // Cast `decoded` to the appropriate type (JwtPayload or any object with a userId)
      const { userId } = decoded as { userId: number };

      // Attach the userId to the request object for later use in the route handlers
      (req as any).user = { userId };

      console.log(decoded);
      next(); // Continue to the next middleware/route handler
    } else {
      return res.sendStatus(403); // Invalid token
    }
  });
};

export default authenticateToken;
