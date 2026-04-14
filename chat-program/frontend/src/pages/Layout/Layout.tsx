import { Outlet } from 'react-router-dom';
import axios from 'axios';	// 백엔드와 통신 (GET 요청)

import { useAuth } from '../../context/AuthContext'; //현재 로그인된 유저의 이름이나 상태

const Layout = () => {
	const username = useAuth(); //유저 이름

	// 로그아웃 함수 정의
	const onLogout = () => {
		axios.get('/auth/logout').then(({ data }) => {
			if (data?.result) {
				location.href = '/';	 // 홈으로 강제 이동 (로그아웃 후 리다이렉션)
			}
		});
	};

	//화면 구조
	return (
		<>
			<header className="fixed-top">
				<nav className="navbar navbar-light bg-light px-4">
					<a className="navbar-brand" href="/">
						goormChatting
					</a>
					<ul className="navbar-nav">
						<li className="nav-item">
							{username ? (	//username이 존재하는지 유무
								<span>
									{username}{' '}
									<button
										className="btn btn-link link-danger"
										onClick={onLogout}
									>
										Logout
									</button>
								</span>
							) : (
								<a className="nav-link" href="/login">
									Login
								</a>
							)}
						</li>
					</ul>
				</nav>
			</header>
			<main className="pt-5 min-vh-100">
				{/* 라우터에 설정된 자식 컴포넌트 실행*/}
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
