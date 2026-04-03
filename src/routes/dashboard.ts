import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getSummary, getCategoryTotals, getRecentActivity } from '../controllers/dashboard';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN', 'ANALYST', 'VIEWER']));

router.get('/summary', getSummary);
router.get('/category-totals', getCategoryTotals);
router.get('/recent-activity', getRecentActivity);

export default router;
