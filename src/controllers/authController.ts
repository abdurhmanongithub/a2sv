import { Request, Response } from "express";
import prisma from "../utils/prisma";
import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import redis from 'redis';

// Create a new user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const pass = req.body.password;
    if (!email || !pass) {
    res.status(400).send("Email and password required");
    return;
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).send("Invalid credentials");
      return;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      res.status(400).send("Invalid credentials");
      return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    const { password, ...userWithoutPassword } = user;
    res.json({ token: token, user: userWithoutPassword });
  } catch (error) {
    console.log(error);

    res.status(500).send("Error logging in");
  }
};
export const register = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  try {
    const existingUser = await UserModel.findByUsernameOrEmail(body.username, body.email);


    if (existingUser) {
      res.status(400).json({ message: "Username or Email already taken" });
      return;
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await UserModel.createUser({
      ...body,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};
export const dashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    res.status(201).json({
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard", error });
  }
};
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const JWT_SECRET = process.env.JWT_SECRET as string;

    jwt.verify(token, JWT_SECRET, (err) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      const redisClient = redis.createClient();
      const TOKEN_EXPIRATION_TIME = 3600; // 1 hour in seconds
      // Add the token to Redis blacklist
      // redisClient.setex(
      //   token,
      //   TOKEN_EXPIRATION_TIME,
      //   "blacklisted",
      //   (redisErr) => {
      //     if (redisErr) {
      //       return res
      //         .status(500)
      //         .json({ message: "Error blacklisting token" });
      //     }

      //     return res.status(200).json({ message: "Logged out successfully" });
      //   }
      // );
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
};

// export const logout = async (req: Request, res: Response): Promise<void> => {
//     const { token } = req.body;
//     if (!token) {
//         res.status(400).send('Token is required');
//         return;
//     }
//     try {
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).send('Could not log out.');
//             }
//             res.redirect('/login'); // Redirect to login page or home page
//         });
//     } catch (error) {
//         res.status(500).send('Error logging out in');
//     }
// };
