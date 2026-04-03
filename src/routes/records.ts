import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getRecords, getRecordById, createRecord, updateRecord, deleteRecord } from '../controllers/records';

const router = Router();

router.use(authenticate);

// ANALYST and ADMIN can read records
router.get('/', authorize(['ADMIN', 'ANALYST']), getRecords);
router.get('/:id', authorize(['ADMIN', 'ANALYST']), getRecordById);

// Only ADMIN can mutate records
router.post('/', authorize(['ADMIN']), createRecord);
router.put('/:id', authorize(['ADMIN']), updateRecord);
router.delete('/:id', authorize(['ADMIN']), deleteRecord);

export default router;
