import Conversation from '../models/conversation/conversation';
import { Types } from 'mongoose';


// 두 유저 사이의 대화방이 존재하면 반환하고, 없으면 새로 생성하는 함수
export const getOrCreateConversation = async (participantIds: string[]) => {
	
	
	if (participantIds.length !== 2) {	// 2명의 유저일때만
		throw new Error('A conversation must have exactly two participants.');
	}

	const [user1, user2] = participantIds.map(id => new Types.ObjectId(id));

	// 두 유저 모두 포함된 대화방이 있는지 찾음
	let conversation = await Conversation.findOne({
		participants: { $all: [user1, user2], $size: 2 },
	});

	if (!conversation) {
		conversation = new Conversation({ participants: [user1, user2] });
		await conversation.save();
	}

	return conversation;
};

export const getUserConversations = async (userId: string) => {
	const conversations = await Conversation.find({ participants: new Types.ObjectId(userId) })
		.populate('participants', 'username')
		.lean();	// 결과를 JS 객체로 반환 (가볍고 빠름)
	return conversations;
};
