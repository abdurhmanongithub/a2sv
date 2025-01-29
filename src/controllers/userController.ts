import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
// Create a new user


export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { ...req.body, password: hashedPassword }
    // if (req?.file?.path) {
    //   userData['photo'] = req?.file?.path;
    // }
    const newUser = await UserModel.createUser(userData);
    res.status(201).json({
      user: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string) || 4; // Default to 10 items per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const search = req.query.search as string ?? '';
  var filter = {};

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: search, } },
          { email: { contains: search } },
        ],
      },
      skip: startIndex,
      take: limit,
    });
    const totalItems = await prisma.user.count({
      where: {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      },
    });
    res.status(200).json({
      page,
      search,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      users: users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await UserModel.getUserById(userId);
    let userWithoutPassword = { ...user }
    delete userWithoutPassword.password;

    if (user) {
      res.status(200).json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userData = { ...req.body, password: hashedPassword }
    // if (req.file?.path) {
    //   userData['photo'] = req.file?.path;
    // }
    const updatedUser = await UserModel.updateUser(userId, userData);
    res.status(200).json({
      user: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    const deletedUser = await UserModel.deleteUser(userId);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
