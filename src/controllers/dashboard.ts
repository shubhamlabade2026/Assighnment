import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: 'EXPENSE' },
    });
    
    const income = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: 'INCOME' },
    });

    const totalIncome = income._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const netBalance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      netBalance,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategoryTotals = async (req: AuthRequest, res: Response) => {
  try {
    const summary = await prisma.record.groupBy({
      by: ['category', 'type'],
      _sum: {
        amount: true,
      },
    });
    
    const formattedSummary = summary.map(item => ({
      category: item.category,
      type: item.type,
      totalAmount: item._sum.amount || 0,
    }));

    res.json(formattedSummary);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const records = await prisma.record.findMany({
      orderBy: { date: 'desc' },
      take: limit,
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        notes: true,
      }
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
