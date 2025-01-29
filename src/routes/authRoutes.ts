import { Router } from 'express';
import { login, register,dashboard, logout } from '../controllers/authController';
import authenticateToken from '../middleware/authMiddleware';

const router = Router();
router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);
router.get('/dashboard',authenticateToken,dashboard);
export default router;