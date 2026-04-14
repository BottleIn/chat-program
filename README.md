# Real-Time Chat Application

 실시간 채팅 애플리케이션

## 주요 기능

- **실시간 채팅**: Socket.io 기반 다중 사용자 실시간 메시징
- **메시지 저장**: 브라우저 새로고침 후에도 채팅 내역 유지
- **채팅 삭제**: 채팅 내역 삭제 기능
- **귓속말(DM)**: 1:1 비공개 메시지 전송
- **파일 공유**: 채팅 및 DM에서 파일 업로드/다운로드

## 기술 스택

### Frontend
- React 18 + TypeScript
- Vite (빌드 도구)
- Bootstrap 5 (CSS 프레임워크)
- Socket.io-client (실시간 통신)
- Axios (HTTP 클라이언트)

### Backend
- Node.js + Express
- TypeScript
- Socket.io (실시간 통신)
- MongoDB + Mongoose (데이터베이스)
- Express-session (세션 관리)
- Multer (파일 업로드)

## 프로젝트 구조

```
chat_program/
├── backend/                 # Express 백엔드 서버
│   ├── src/
│   │   ├── models/          # Mongoose 스키마
│   │   ├── routes/          # Express 라우터
│   │   ├── services/        # 비즈니스 로직
│   │   └── sockets/         # Socket.io 핸들러
│   └── index.ts             # 서버 진입점
├── frontend/                # React 프론트엔드
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── context/         # React Context
│   │   └── pages/           # 페이지 컴포넌트
│   └── vite.config.ts
├── .eslintrc.js
├── .prettierrc.js
└── package.json
```

## 설치 및 실행

### 사전 요구사항

- Node.js (v18 이상 권장)
- MongoDB
- npm 또는 yarn

### 1. 의존성 설치

```bash
# 루트 디렉토리에서
cd byby123
npm install

# 백엔드 의존성 설치
cd backend
npm install

# 프론트엔드 의존성 설치
cd ../frontend
npm install
```

### 2. 환경 변수 설정

루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 입력:

```bash
# 프론트엔드용 - 백엔드 서버 URL (4000번 포트)
VITE_SERVER_URL=http://localhost:4000

# 백엔드용 - 프론트엔드 URL (3000번 포트)
CLIENT_URL=http://localhost:3000

# MongoDB 연결 문자열
MONGO_URI=mongodb://localhost:27017/chat-app
```

### 3. MongoDB 실행

```bash
# MongoDB 시작
npm run start:db
# 또는 직접 실행
mongod
```

### 4. 개발 서버 실행

```bash
# 루트 디렉토리에서 프론트엔드 + 백엔드 동시 실행
npm run start:dev
```

또는 개별 실행:

```bash
# 백엔드 (터미널 1)
cd backend
npm run dev

# 프론트엔드 (터미널 2)
cd frontend
npm run dev
```

### 5. 접속

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:4000

## 스크립트

### 루트 (`byby123/`)

| 명령어 | 설명 |
|--------|------|
| `npm run start:dev` | 개발 모드로 프론트엔드 + 백엔드 실행 |
| `npm run start:prod` | 프로덕션 빌드 후 실행 |
| `npm run start:db` | MongoDB 시작 |
| `npm run lint` | 전체 코드 린트 |
| `npm run format` | 전체 코드 포맷팅 |

### 백엔드 (`byby123/backend/`)

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | nodemon으로 개발 서버 실행 |
| `npm run build` | TypeScript 컴파일 |
| `npm start` | 프로덕션 서버 실행 |

### 프론트엔드 (`byby123/frontend/`)

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |

## API 엔드포인트

### 인증 (`/auth`)
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인
- `GET /auth/logout` - 로그아웃
- `GET /auth/id` - 현재 로그인 사용자 조회

### 메시지 (`/messages`)
- `DELETE /messages/:id` - 메시지 삭제
- `DELETE /messages/clear` - 전체 메시지 삭제
- `DELETE /messages/clear/:conversationId` - 대화방 메시지 삭제

### 대화 (`/conversations`)
- `POST /conversations` - 1:1 대화방 생성/조회

### 파일 (`/files`)
- `POST /files/upload` - 파일 업로드
- `GET /files/download/:messageId` - 파일 다운로드

### 사용자 (`/users`)
- `GET /users` - 전체 사용자 목록 조회

## Socket.io 이벤트

### 클라이언트 → 서버
- `chat message` - 메시지 전송
- `loadMessages` - 메시지 목록 요청
- `joinConversation` - 대화방 입장
- `leaveConversation` - 대화방 퇴장

### 서버 → 클라이언트
- `chat message` - 새 메시지 수신
- `messagesLoaded` - 메시지 목록 수신

