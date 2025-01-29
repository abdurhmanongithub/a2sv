import { PrismaClient, Blog } from '@prisma/client';

const prisma = new PrismaClient();

export class BlogModel {
  // Create a new blog
  static async createBlog(data: { title: string; content: string; userId: number; photo?: string }): Promise<Blog> {
    return prisma.blog.create({
      data,
    });
  }

  // Get all blogs
  static async getAllBlogs(): Promise<Blog[]> {
    return prisma.blog.findMany();
  }

  // Get a blog by ID
  static async getBlogById(id: number): Promise<Blog | null> {
    return prisma.blog.findUnique({
      where: { id },
    });
  }

  // Update a blog
  static async updateBlog(id: number, data: Partial<Blog>): Promise<Blog> {
    return prisma.blog.update({
      where: { id },
      data,
    });
  }

  // Delete a blog
  static async deleteBlog(id: number): Promise<Blog> {
    return prisma.blog.delete({
      where: { id },
    });
  }
}
