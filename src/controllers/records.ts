import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';
import { recordSchema } from '../validators';

export const getRecords = async (req: AuthRequest, res: Response) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    
    let whereClause: any = {};
    if (type) whereClause.type = type as string;
    if (category) whereClause.category = category as string;
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate as string);
      if (endDate) whereClause.date.lte = new Date(endDate as string);
    }

    const records = await prisma.record.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { date: 'desc' },
    });
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecordById = async (req: AuthRequest, res: Response) => {
  try {
    const record = await prisma.record.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
    });
    if (!record) return res.status(404).json({ error: 'Record not found' });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createRecord = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = recordSchema.parse(req.body);
    const record = await prisma.record.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
        createdById: req.user!.id,
      },
    });
    res.status(201).json(record);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateRecord = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = recordSchema.partial().parse(req.body);
    
    // Convert date string if provided
    let dataToUpdate: any = { ...validatedData };
    if (validatedData.date) {
      dataToUpdate.date = new Date(validatedData.date);
    }

    const record = await prisma.record.update({
      where: { id: Number(req.params.id) },
      data: dataToUpdate,
    });
    res.json(record);
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ errors: error.errors });
    res.status(500).json({ error: 'Internal server error or record not found' });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.record.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error or record not found' });
  }
};
