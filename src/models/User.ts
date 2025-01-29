import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class UserModel {
  static async findByUsernameOrEmail(
    username: string,
    email: string
  ): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
  }
  // Create a new user
  static async createUser(data: Omit<User, "id">): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  // Get all users
  static async getAllUsers(): Promise<Omit<User, "password">[] | undefined> {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        photo: true,
        role: true,
        bio: true,
        username: true,
      },
    });
  }

  // Get a user by ID
  static async getUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  // Update a user
  static async updateUser(
    id: number,
    data: Partial<Omit<User, "id">>
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete a user
  static async deleteUser(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
