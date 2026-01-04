import crypto from 'crypto';
import { Types } from 'mongoose';

import User from './schema'; // userModel을 가져옴
import { UserInterface } from '../../types';

export const createUser = async (
	username: string,
	password: string
): Promise<UserInterface> => {
	if (!username || typeof username !== 'string') {
		throw new Error('Invalid username');
	}

	if (!password || typeof password !== 'string') {
		throw new Error('Invalid password');
	}

	const hashedPassword = crypto
		.createHash('sha512')	//해시 알고리즘으로 비밀번호를 암호화
		.update(password)
		.digest('base64');

	const user = new User({ username, password: hashedPassword }); // User 모델을 사용하여 새 사용자 생성
	const savedUser = await user.save(); 						   // 데이터베이스에 저장

	return { id: (savedUser._id as Types.ObjectId).toString(), username: savedUser.username };
};

export const isExistUser = async (username: string): Promise<boolean> => {
	if (!username || typeof username !== 'string') {
		throw new Error('Invalid username');
	}

	const result = await User.exists({ username });

	return !!result;
};

export const getUser = async (
	username: string,
	password: string
): Promise<UserInterface | null> => {
	if (!username || typeof username !== 'string') {
		throw new Error('Invalid userId');
	}

	if (!password || typeof password !== 'string') {
		throw new Error('Invalid password');
	}

	const hashedPassword = crypto
		.createHash('sha512')
		.update(password)
		.digest('base64');

	const result = await User.findOne(
		{ username, password: hashedPassword },
		{ __v: 0, password: 0 }
	).lean();

	if (!result) {
		return null;
	}

	return { id: (result._id as Types.ObjectId).toString(), username: result.username };
};

export default User;
