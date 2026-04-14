import Message from '../models/message/message';
import { Types } from 'mongoose';
import fs from 'fs';
import path from 'path';

export const clearUserMessages = async (userId: string): Promise<void> => {
	
	// 파일이 첨부된 해당 유저의 메시지들 찾기
	const messagesToDelete = await Message.find({ user: new Types.ObjectId(userId), 'file.path': { $exists: true } });

	// 첨부된 파일 실제로 파일 시스템에서 삭제
	for (const message of messagesToDelete) {
		if (message.file && message.file.path) {
			const filePath = path.join(__dirname, '..', '..', 'uploads', path.basename(message.file.path));
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error(`Error deleting file ${filePath}:`, err);
				}
			});
		}
	}

	// 해당 유저의 메시지 전부 DB에서 삭제
	await Message.deleteMany({ user: new Types.ObjectId(userId) });
};

export const deleteMessage = async (messageId: string, userId: string): Promise<boolean> => {
	const message = await Message.findOne({ _id: new Types.ObjectId(messageId), user: new Types.ObjectId(userId) });

	if (!message) {
		return false;
	}

	if (message.file && message.file.path) {
		const filePath = path.join(__dirname, '..', '..', 'uploads', path.basename(message.file.path));
		fs.unlink(filePath, (err) => {
			if (err) {
				console.error(`Error deleting file ${filePath}:`, err);
			}
		});
	}

	const result = await Message.deleteOne({ _id: new Types.ObjectId(messageId), user: new Types.ObjectId(userId) });
	return result.deletedCount === 1;
};
