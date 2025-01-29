import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

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

    (req as any).user = decoded; // ✅ Attach decoded user payload to request object
    next(); // ✅ Call next() to continue processing
  });
};

export default authenticateToken;
