import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

// Context가 관리할 값의 타입 정의: username만 포함 (null 가능)
interface AuthContextType {
	username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider: 로그인 정보를 전역으로 제공하는 Context Provider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

	// username 상태: 기본값은 null (로그인 안 된 상태)
	const [username, setUsername] = useState<string | null>(null);

	//로그인된 유저 정보 가져오기
	useEffect(() => {
		axios.get('/auth/id').then(({ data }) => {
			if (data.username) {
				setUsername(data.username);
			}
		});
	}, []);

	// Context의 값으로 username을 제공
	return (
		<AuthContext.Provider value={{ username }}>
			{children}
		</AuthContext.Provider>
	);
};

// useAuth: username 값을 쉽게 가져올 수 있게 도와줌
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context.username;
};
