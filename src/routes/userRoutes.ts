import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, createUser } from '../controllers/userController';
// import { storage } from '../utils/storage';
import multer from 'multer';
import { storage } from '../utils/storage';

const upload = multer({ storage: storage });
const router = Router();

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.post('/', upload.single('photo'), createUser);

router.put('/:id',upload.single('photo'), updateUser);

router.delete('/:id', deleteUser);

export default router;