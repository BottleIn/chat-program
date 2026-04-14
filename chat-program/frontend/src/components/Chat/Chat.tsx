import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

import HistoryIcon from '../../assets/history.svg';
import SendIcon from '../../assets/send.svg';
import UploadIcon from '../../assets/upload.svg';



interface Message {
	_id: string;
	user: string;
	content?: string;
	createdAt: string;
	file?: {
		filename: string;
		path: string;
		mimetype: string;
		size: number;
	};
}

interface User {
	_id: string;
	username: string;
}

const Chat = () => {
	/*
	messages: 현재 화면에 출력할 메시지 목록

	message: 입력창에 있는 텍스트

	users: 현재 로그인된 유저를 제외한 유저 목록

	selectedUser: 귓속말 대화 상대 지정

	conversationId: 대화방 주소 저장
	
	*/
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState('');
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [conversationId, setConversationId] = useState<string | undefined>(undefined);
	const { socket } = useSocket();
	const loggedInUser = useAuth();	// 현재 로그인된 유저 이름
	const messagesEndRef = useRef<HTMLDivElement>(null);	//메시지 맨 아래로 스크롤하기 위한 참조

	// Fetch all users
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
					credentials: 'include', //쿠키나 세션 정보도 같이 보냄
				});
				if (response.ok) {
					const data = await response.json();

					// 자기 자신은 제외하고 users 상태에 저장
					setUsers(data.users.filter((user: User) => user.username !== loggedInUser));
				} else {
					console.error('Failed to fetch users');
				}
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};
		fetchUsers();
	}, [loggedInUser]);	//loggedInUser가 바뀔 때마다 => 로그인 완료 시 또는 사용자 정보가 갱신될 때 

	// Load messages for selected conversation or general chat
	useEffect(() => {
		if (socket) {
			// 대화방 메시지 요청 (이벤트 이름, 데이터)
			socket.emit('loadMessages', conversationId);

			// 서버가 기존 메시지를 보내줌 → 화면에 표시
			socket.on('messagesLoaded', (loadedMessages: Message[]) => {
				setMessages(loadedMessages);
			});
			
			// 새 메시지가 오면 기존 메시지에 추가
			socket.on('chat message', (msg: Message) => {
				setMessages((prevMessages) => [...prevMessages, msg]);
			});
		}

		return () => {
			socket?.off('messagesLoaded');
			socket?.off('chat message');
		};
	}, [socket, conversationId]);

	
	//메시지(messages)가 바뀔 때마다 → 마지막 메시지 위치로 스크롤 내려감
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);


	// 대화방에 참여하거나 나갈 때
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (message.trim()) {	//공백이 아닌지 판별
			socket?.emit('chat message', { content: message, conversationId });
			setMessage('');
		}
	};

	// 채팅 내역 전체 삭제
	const handleClearChat = async () => {
		try {
			const url = conversationId
				? `${import.meta.env.VITE_SERVER_URL}/messages/clear/${conversationId}`
				: `${import.meta.env.VITE_SERVER_URL}/messages/clear`;
			const response = await fetch(url, {
				method: 'DELETE',
				credentials: 'include',
			});
			if (response.ok) {
				setMessages((prevMessages) => prevMessages.filter((msg) => msg.user !== loggedInUser));
				alert('채팅 내역이 삭제되었습니다.');
			} else {
				const errorData = await response.json();
				alert(`채팅 내역 삭제 실패: ${errorData.message}`);
			}
		} catch (error) {
			console.error('채팅 내역 삭제 중 오류 발생:', error);
			alert('채팅 내역 삭제 중 오류가 발생했습니다.');
		}
	};

	// 메시지 삭제
	const handleDeleteMessage = async (messageId: string) => {
		if (!window.confirm('정말로 이 메시지를 삭제하시겠습니까?')) {
			return;
		}
		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/messages/${messageId}`, {
				method: 'DELETE',
				credentials: 'include',
			});
			if (response.ok) {
				setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
			} else {
				const errorData = await response.json();
				alert(`메시지 삭제 실패: ${errorData.message}`);
			}
		} catch (error) {
			console.error('메시지 삭제 중 오류 발생:', error);
			alert('메시지 삭제 중 오류가 발생했습니다.');
		}
	};

	// 귓속말 상대 선택
	const handleUserSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
		const targetUsername = event.target.value;
		if (targetUsername === 'general') {	//전체 채팅
			setSelectedUser(null);
			setConversationId(undefined);
			socket?.emit('leaveConversation', conversationId);
		} 
		else { // 특정 유저
			const user = users.find((u) => u.username === targetUsername);
			if (user) {
				setSelectedUser(user);
				try {
					const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/conversations`, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						credentials: 'include',
						body: JSON.stringify({ targetUserId: user._id }),
					});
					if (response.ok) {
						const data = await response.json();
						setConversationId(data.conversationId);
						socket?.emit('joinConversation', data.conversationId);
					} else {
						console.error('Failed to get or create conversation');
					}
				} catch (error) {
					console.error('Error getting or creating conversation:', error);
				}
			}
		}
	};


	// 파일 업로드 처리
	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);


		if (conversationId) { //귓속말 중이라면 → 해당 대화방 ID도 같이 전송
			formData.append('conversationId', conversationId);
		}

		try {
			const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/files/upload`, {
				method: 'POST',
				body: formData,
				credentials: 'include',
			});

			if (response.ok) {
				// 파일 업로드 성공 후, Socket.IO를 통해 메시지 전송 (백엔드에서 처리)
			} else {
				const errorData = await response.json();
				alert(`파일 업로드 실패: ${errorData.message}`);
			}
		} catch (error) {
			console.error('파일 업로드 중 오류 발생:', error);
			alert('파일 업로드 중 오류가 발생했습니다.');
		}
	};

	
	return (
		<main className="container-fluid d-flex flex-column h-100 overflow-hidden border rounded-3 p-0">
			<div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">


				<button onClick={handleClearChat} className="btn btn-danger d-flex align-items-center">
					<img src={HistoryIcon} alt="Clear History" style={{ width: '1.2em', height: '1.2em', marginRight: '0.3em' }} />
					채팅 내역 전체 삭제
				</button>


				<select onChange={handleUserSelect} value={selectedUser?.username || 'general'} className="form-select w-auto" aria-label="대화 상대 선택">
					<option value="general">전체 채팅</option>
					{users.map((user) => (
						<option key={user._id} value={user.username}>
							{user.username} (귓속말)
						</option>
					))}
				</select>


			</div>
			<ul id="messages" aria-live="polite" aria-atomic="false" className="flex-grow-1 overflow-auto p-3 bg-light list-unstyled">
				{messages.map((msg) => (
					<li key={msg._id} className="mb-2 p-2 rounded bg-light-subtle d-flex justify-content-between align-items-center">
						
						<strong>{msg.user}:</strong> {msg.file && msg.file.filename ? (
							<a href={`${import.meta.env.VITE_SERVER_URL}/files/download/${msg._id}`} target="_blank" rel="noopener noreferrer">
								{msg.file.filename} ({msg.file.size ? `${Math.round(msg.file.size / 1024)} KB` : 'Unknown size'})
							</a>
						) : (
							msg.content
						)}

						{/* 메시지 작성 시간 표시 */}
						<span className="text-muted ms-1 small">({new Date(msg.createdAt).toLocaleTimeString()})</span>

						{/* 로그인한 유저가 보낸 메시지라면 삭제 버튼 표시 */}
						{loggedInUser === msg.user && (
							<button
								onClick={() => handleDeleteMessage(msg._id)}
								className="btn btn-warning btn-sm ms-2"
							>
									삭제
							</button>
						)}

					</li>
				))}
				<div ref={messagesEndRef} />

				{/* 메시지 입력란 */}
			</ul>
			<form onSubmit={handleSubmit} className="d-flex p-3 border-top bg-white">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder={selectedUser ? `${selectedUser.username}에게 귓속말...` : "메시지를 입력하세요..."}
					className="form-control flex-grow-1 me-2"
					aria-label="메시지 입력"
				/>
				<label htmlFor="file-upload" className="btn btn-success me-2 btn-sm d-flex align-items-center">
					<img src={UploadIcon} alt="Upload File" style={{ width: '1.2em', height: '1.2em', marginRight: '0.3em' }} />
					파일 선택
				</label>
				<input id="file-upload" type="file" onChange={handleFileUpload} className="d-none" />
				<button type="submit" className="btn btn-primary btn-sm d-flex align-items-center">
					<img src={SendIcon} alt="Send Message" style={{ width: '1.2em', height: '1.2em', marginRight: '0.3em' }} />
					전송
				</button>
			</form>
		</main>
	);
};

export default Chat;