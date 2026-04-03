import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/users';

const router = Router();

router.use(authenticate);
router.use(authorize(['ADMIN']));

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
