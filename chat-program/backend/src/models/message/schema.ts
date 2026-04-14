import { Schema } from 'mongoose';

const MessageSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'Users',
		required: true,
	},
	conversation: {
		type: Schema.Types.ObjectId,
		ref: 'Conversation',
		required: false, // 귓속말이 아닌 일반 메시지는 conversation이 없을 수 있음
	},
	content: {
		type: String,
		required: false, // 파일 메시지의 경우 content가 없을 수 있음
	},
	file: {
		filename: String,
		path: String,
		mimetype: String,
		size: Number,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default MessageSchema;