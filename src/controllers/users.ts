import { Request, Response } from 'express';
import prisma from '../prisma';
import { userUpdateSchema } from '../validators';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const validatedData = userUpdateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: validatedData,
      select: { id: true, name: true, email: true, role: true, status: true },
    });
    res.json(user);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Internal server error or user not found' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error or user not found' });
  }
};
