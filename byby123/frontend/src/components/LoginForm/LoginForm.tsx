import React, { useState } from 'react';
import axios from 'axios';

interface LoginFormProps {
	type: 'signup' | 'login';
}

interface UrlMapInterface {
	signup: string;
	login: string;
}

const LoginForm = ({ type }: LoginFormProps) => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');

	const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
	};

	const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};

	// 사용자가 입력한 아이디/비밀번호를 서버로 전송
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();	// 새로고침 방지

		const URL_MAP: UrlMapInterface = {
			signup: '/auth/signup',
			login: '/auth/login',
		};


		const FALLBACK_URL: string = URL_MAP.signup;	// 오류방지

		try {
			const { data } = await axios.post(URL_MAP[type] || FALLBACK_URL, {
				username,
				password,
			});

			if (data) {
				if (type === 'signup') {
					location.href = '/login';
					return;
				}

				location.href = '/';
			}
		} catch (error: any) {
			setError(error.response?.data?.message || 'Please try again');
		}
	};

	return (
		<div className="container-fluid d-flex justify-content-center align-items-center vh-100">
			<div className="card p-4" style={{ maxWidth: '40rem' }}>
				{error && (
					<div className="alert alert-danger" role="alert">
						{error}
					</div>
				)}

				{/* 로그인 or 회원가입 폼 */}
				<form onSubmit={onSubmit}>

					{/* Username 입력 필드 */}	
					<div className="mb-3">
						<label htmlFor="username" className="form-label">Username</label>
						<input
							type="text"
							className="form-control"
							id="username"
							aria-describedby="usernameHelp"
							placeholder="john.doe"
							value={username}
							onChange={onChangeUsername}
						/>
					</div>

					{/* Password 입력 필드 */}
					<div className="mb-3">
						<label htmlFor="password" className="form-label">Password</label>
						<input
							type="password"
							className="form-control"
							id="password"
							placeholder="Your Password"
							value={password}
							onChange={onChangePassword}
						/>
					</div>

					{/* 제출 버튼 (Signup 또는 Login으로 바뀜) */}
					<button type="submit" className="btn btn-primary w-100 mb-3">
						{type === 'signup' ? 'Signup' : 'Login'}
					</button>

					{/* 회원가입/로그인 전환 링크 */}
					<div className="text-center">
						<a
							className="text-muted"
							href={type === 'signup' ? '/login' : '/signup'}
						>
							Or {type === 'signup' ? 'Login' : 'Signup'}
						</a>
					</div>
				</form>
			</div>
		</div>
	);
};


export default LoginForm;
