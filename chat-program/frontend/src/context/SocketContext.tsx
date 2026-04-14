import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
	socket: Socket;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// socket.io로 서버와 연결 생성 (한 번만 만듦)
const socketInstance = io(import.meta.env.VITE_SERVER_URL, {
	withCredentials: true,
});

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isConnected, setIsConnected] = useState<boolean>(socketInstance.connected);

	useEffect(() => {
		const onConnect = () => {
			setIsConnected(true);
		};

		const onDisconnect = () => {
			setIsConnected(false);
		};

		socketInstance.on('connect', onConnect);
		socketInstance.on('disconnect', onDisconnect);

		return () => {	//컴포넌트가 사라질 때, 아까 등록한 이벤트 리스너는 제거
			socketInstance.off('connect', onConnect);
			socketInstance.off('disconnect', onDisconnect);
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket: socketInstance, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (context === undefined) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};
