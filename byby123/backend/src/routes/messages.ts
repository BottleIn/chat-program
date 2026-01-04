import express from 'express';
import { Request, Response } from 'express';
import { clearUserMessages, deleteMessage } from '../services/message';

const router = express.Router();

// 현재 로그인한 사용자의 모든 메시지 삭제
router.delete('/clear', async (req: Request, res: Response) => {
	const user = (req.session as any).user;

	if (!user || !user.id) {
		return res.status(401).json({ result: false, message: 'Unauthorized' });
	}

	try {
		await clearUserMessages(user.id);
		res.status(200).json({ result: true, message: 'Chat history cleared' });
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});


// 특정 메시지를 삭제 (자신이 작성한 메시지만)
router.delete('/:messageId', async (req: Request, res: Response) => {
	const user = (req.session as any).user;
	const { messageId } = req.params;

	if (!user || !user.id) {
		return res.status(401).json({ result: false, message: 'Unauthorized' });
	}

	try {
		const deleted = await deleteMessage(messageId, user.id);
		if (deleted) {
			res.status(200).json({ result: true, message: 'Message deleted' });
		} else {
			res.status(404).json({ result: false, message: 'Message not found or not authorized' });
		}
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

export default router;
