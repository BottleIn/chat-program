import { Server as ServerType } from 'http';
import { Server } from 'socket.io';
import { Types } from 'mongoose';

import { CorsConfigInterface } from '../types';
import Message from '../models/message/message';
import User from '../models/user/user';
import Conversation from '../models/conversation/conversation';

const initSocketServer = (
	server: ServerType,
	session: any,
	corsConfig: CorsConfigInterface
) => {
	const io = new Server(server, {
		cors: corsConfig,
	});

	io.engine.use(session);

	io.on('connection', async (socket) => {
		socket.on('socket_ping', () => {
			socket.emit('socket_pong');
		});
		
		// 일반 메시지 또는 귓속말 메시지 처리
		socket.on('chat message', async ({ content, conversationId }: { content: string; conversationId?: string }) => {
			const user = (socket.request as any).session.user;
			if (!user) return;

			const newMessage = new Message({
				user: user.id,
				content: content,
				conversation: conversationId ? new Types.ObjectId(conversationId) : undefined,
			});
			await newMessage.save();

			const messageData = { _id: newMessage._id, user: user.username, content: content, createdAt: newMessage.createdAt };

			if (conversationId) {
				// 귓속말은 해당 대화방으로만 전송
				io.to(conversationId).emit('chat message', messageData);
			} else {
				// 일반 메시지는 전체에게 전송
				io.emit('chat message', messageData);
			}
		});

		socket.on('loadMessages', async (conversationId?: string) => {
			let messages;
			if (conversationId) {
				// 귓속말 메시지 로드
				messages = await Message.find({ conversation: new Types.ObjectId(conversationId) })
					.populate<{ user: { username: string } }>('user', 'username')
					.sort('createdAt')
					.limit(100);
			} else {
				// 일반 메시지 로드
				messages = await Message.find({ conversation: { $exists: false } })
					.populate<{ user: { username: string } }>('user', 'username')
					.sort('createdAt')
					.limit(100);
			}
			socket.emit('messagesLoaded', messages.map(msg => ({ _id: msg._id, user: msg.user.username, content: msg.content, createdAt: msg.createdAt, file: msg.file })));
		});

		socket.on('joinConversation', (conversationId: string) => {
			socket.join(conversationId);
		});

		socket.on('leaveConversation', (conversationId: string) => {
			socket.leave(conversationId);
		});
	});

	return io;
};

export default initSocketServer;
