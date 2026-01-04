import express from 'express';
import { Request, Response } from 'express';
import User from '../models/user/user';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
	try {
		const users = await User.find({}, 'username').lean();
		res.status(200).json({ result: true, users });
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

export default router;
