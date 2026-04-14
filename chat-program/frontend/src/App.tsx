import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Layout from '@pages/Layout';
import Home from '@pages/Home';
import Login from '@pages/Login';
import Signup from '@pages/Signup';

function App() {
	return (
		<div className="App">
			<BrowserRouter> {/* 라우팅을 위한 브라우저 라우터 설정 */}
				<Routes> {/* 라우트들을 정의 */}
					<Route path="/" element={<Layout />}> {/* 기본 레이아웃 라우트 */}
						<Route path="/" element={<Home />} /> {/* 홈 페이지 */}
						<Route path="login" element={<Login />} /> {/* 로그인 페이지 */}
						<Route path="signup" element={<Signup />} /> {/* 회원가입 페이지 */}
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
