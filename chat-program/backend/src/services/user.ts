import { createUser, isExistUser, getUser } from '../models/user/user';

import { UserInterface } from '../types';

export const signup = async (
	username: string,
	password: string
): Promise<UserInterface> => {
	try {
		const isExist = await isExistUser(username);
		if (isExist) {
			throw new Error('Already exist username');
		}

		return createUser(username, password);
	} catch (error: any) {
		throw new Error(error.message || 'Failed to signup');
	}
};

export const login = async (
	username: string,
	password: string
): Promise<UserInterface> => {
	try {
		const user = await getUser(username, password);

		if (!user) {
			throw new Error('username or password is invalid');
		}

		return user;
	} catch (error: any) {
		throw new Error(error.message || 'Failed to signup');
	}
};
