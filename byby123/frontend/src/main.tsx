import { createRoot } from 'react-dom/client';
import axios from 'axios';
import 'bootstrap';

import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.withCredentials = true;	//쿠키+세션 정보

const container = document.getElementById('root');
const root = createRoot(container!);


root.render(
		<AuthProvider>
			<SocketProvider>
				<App />
			</SocketProvider>
		</AuthProvider>
);
