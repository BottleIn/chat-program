import express from 'express';
import { Request, Response } from 'express';
import { getOrCreateConversation, getUserConversations } from '../services/conversation';

const router = express.Router();

// 나와 상대방 간의 대화방 만들기 (또는 재사용)
router.post('/', async (req: Request, res: Response) => {

	const user = (req.session as any).user;	// 현재 로그인한 유저
	const { targetUserId } = req.body;		// 대화 상대의 ID

	if (!user || !user.id) {
		return res.status(401).json({ result: false, message: 'Unauthorized' });
	}

	if (!targetUserId) {
		return res.status(400).json({ result: false, message: 'targetUserId is required' });
	}

	try {
		const conversation = await getOrCreateConversation([user.id, targetUserId]);
		res.status(200).json({ result: true, conversationId: conversation._id });
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

// 	내가 포함된 전체 대화방 목록 가져오기
router.get('/', async (req: Request, res: Response) => {
	const user = (req.session as any).user;

	if (!user || !user.id) {
		return res.status(401).json({ result: false, message: 'Unauthorized' });
	}

	try {
		const conversations = await getUserConversations(user.id);
		res.status(200).json({ result: true, conversations });
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

export default router;
