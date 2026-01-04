import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose'; // MongoDB 연결
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRouter from './src/routes/auth';
import messagesRouter from './src/routes/messages';
import conversationsRouter from './src/routes/conversations';
import usersRouter from './src/routes/users';
import filesRouter from './src/routes/files';
import initSocketServer from './src/sockets';

import { CorsConfigInterface } from './src/types';

// Ensure User model is registered with Mongoose
import './src/models/user/user';

dotenv.config({ path: '../.env' });

const app = express();
const server = createServer(app);


const sessionInstance = session({
	secret: 'goorm_fullstack_internship_mission',	// 암호화 키
	resave: false,
	saveUninitialized: false,
	cookie: { path: '/', maxAge: 1000 * 60 * 60 * 60 * 24 },
});

//다른 주소에서 온 요청을 서버가 허용할지 정하는 보안 장치
const corsConfig: CorsConfigInterface = {
	origin: process.env.CLIENT_URL!,
	credentials: true,
};

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(sessionInstance);

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//라우터 등록
app.use('/auth', authRouter);
app.use('/messages', messagesRouter);
app.use('/conversations', conversationsRouter);
app.use('/users', usersRouter);
app.use('/files', filesRouter);

mongoose
	.connect(process.env.MONGO_URI as string)
	.then(() => console.log('Successfully connected to mongodb'))
	.catch((e: Error) => console.error(e));

const io = initSocketServer(server, sessionInstance, corsConfig);
app.set('io', io);

//서버 시작
server.listen(4000, () => console.log('Server listening on port 4000'));
