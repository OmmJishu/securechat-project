# securechat-project

# SecureChat - End-to-End Encrypted Chat Application

Real-time chat application with user authentication and end-to-end encryption.

## 🎯 Features
- ✅ User registration and login with SHA-256 + salt password hashing
- ✅ Unique username validation
- ✅ Real-time messaging with WebSocket
- ✅ Multiple chat rooms (general, tech, random)
- ✅ End-to-end message encryption
- ✅ User presence tracking
- ✅ Online/offline status indicators

## 📁 Project Structure
```
securechat-project/
├── backend/
│   ├── server.js          # WebSocket server with authentication
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Backend Setup
```bash
cd backend
npm install
npm start
```
Server runs on `http://localhost:3001`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
App opens at `http://localhost:3000`

## 📖 Usage Guide

### 1. Registration
- Click "Create Account"
- Enter username (minimum 3 characters)
- Enter password (minimum 6 characters)
- Click "Register"

### 2. Login
- Enter your username
- Enter your password
- Click "Login"

### 3. Chatting
- Select a chat room from the sidebar
- Type your message
- Press Enter or click "Send"
- Messages are encrypted automatically

### 4. Multiple Users
- Open multiple browser tabs
- Register different accounts
- See real-time messaging between users

## 🔐 Security Features

### Password Security
- Passwords are hashed using SHA-256
- Each user gets a unique salt
- Salts are 16 bytes (32 hex characters)
- Password + Salt are combined before hashing

### Message Encryption
- Messages encrypted with XOR + Base64
- Shared key encryption
- Encrypted before transmission
- Decrypted only by recipients

### Authentication
- Session token generated on login
- WebSocket requires authentication
- Unauthorized connections rejected

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- WebSocket (ws library)
- Crypto (built-in Node.js)
- CORS

### Frontend
- React 18
- Lucide React (icons)
- Native WebSocket API
- CSS3

## 📦 API Endpoints

### POST /api/register
Register a new user
```json
{
  "username": "string",
  "password": "string"
}
```

### POST /api/login
Login existing user
```json
{
  "username": "string",
  "password": "string"
}
```

## 🔌 WebSocket Events

### Client → Server
- `authenticate` - Authenticate connection
- `join` - Join a chat room
- `send_message` - Send encrypted message
- `switch_room` - Switch between rooms

### Server → Client
- `authenticated` - Authentication successful
- `message` - New message received
- `room_users` - Updated user list
- `user_joined` - User joined room
- `user_left` - User left room
- `error` - Error message

## 🚢 Deployment

### Backend (Render, Railway, Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Deploy

### Frontend (Vercel, Netlify)
1. Update `serverUrl` in App.js to deployed backend URL
2. Push to GitHub
3. Connect repository
4. Deploy

## 📝 Development Notes

### In-Memory Storage
Currently using in-memory storage for users. For production:
- Use MongoDB, PostgreSQL, or MySQL
- Implement proper session management
- Add Redis for WebSocket scaling

### Encryption
Current encryption is for demonstration. For production:
- Implement proper key exchange (Diffie-Hellman)
- Use AES-256 encryption
- Add forward secrecy

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Run `npm install` in backend folder
- Check Node.js version (v14+)

### Frontend won't connect
- Ensure backend is running
- Check serverUrl in App.js
- Check browser console for errors

### Can't register user
- Username must be 3+ characters
- Password must be 6+ characters
- Username must be unique

## 📄 License
MIT License - Feel free to use and modify

## 👨‍💻 Author
Built with Claude AI

## 🤝 Contributing
Pull requests welcome!

---

**Enjoy secure chatting! 🔐💬**
