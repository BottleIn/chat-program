import express, { Request, Response } from 'express';
import multer from 'multer'; // 파일 업로드를 위한 미들웨어
import path from 'path';
import Message from '../models/message/message';
import { Types } from 'mongoose';

const router = express.Router();

// 파일 저장 방식 설정 (uploads 폴더에 저장)
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); // 저장 폴더
	},
	filename: (req, file, cb) => {
		// 파일 이름 = 현재시간-원래파일이름
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

//  multer 인스턴스 생성 (파일 업로드 처리기)
const upload = multer({ storage: storage });


// 로그인한 사용자가 파일 업로드 → 메시지로 저장
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
	const user = (req.session as any).user;
	const { conversationId } = req.body; // 어떤 대화방인지

	// 로그인하지 않은 사용자 차단
	if (!user || !user.id) {
		return res.status(401).json({ result: false, message: 'Unauthorized' });
	}

	// 파일이 없는 경우
	if (!req.file) {
		return res.status(400).json({ result: false, message: 'No file uploaded' });
	}

	try {
		// 새 메시지 생성 (파일 포함)
		const newMessage = new Message({
			user: user.id,
			content: req.file.originalname, // 메시지 내용 대신 파일 이름 사용
			conversation: conversationId ? new Types.ObjectId(conversationId) : undefined,
			file: {
				filename: req.file.originalname,
				path: req.file.path,
				mimetype: req.file.mimetype,
				size: req.file.size,
			},
		});
		await newMessage.save(); // DB에 저장

		// 소켓으로 실시간 메시지 전송
		const io = req.app.get('io');
		const messageData = { 
			_id: newMessage._id,
			user: user.username,
			content: newMessage.content,
			createdAt: newMessage.createdAt,
			file: newMessage.file
		};

		// 특정 대화방에만 보낼지 전체에 보낼지
		if (conversationId) {
			io.to(conversationId).emit('chat message', messageData); // 1:1 방
		} else {
			io.emit('chat message', messageData); // 전체방
		}

		// 업로드 성공 응답
		res.status(200).json({ result: true, message: 'File uploaded successfully', file: newMessage.file });
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});


// 특정 메시지 ID로 파일 다운로드
router.get('/download/:messageId', async (req, res) => {
	try {
		const message = await Message.findById(req.params.messageId);

		// 파일이 없거나 잘못된 경우
		if (!message || !message.file || !message.file.path || !message.file.filename) {
			return res.status(404).json({ result: false, message: 'File not found' });
		}

		// 파일 다운로드 응답
		res.download(message.file.path, message.file.filename);
	} catch (error: any) {
		res.status(500).json({ result: false, message: error.message });
	}
});

export default router;
