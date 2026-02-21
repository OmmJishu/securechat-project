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
# SecureChat - End-to-End Encrypted Chat Application

Real-time chat application with user authentication and message encryption.

## 🎯 Features

- ✅ User registration and login with SHA-256 + salt password hashing
- ✅ Unique username validation
- ✅ Real-time messaging with WebSocket
- ✅ Multiple chat rooms (general, tech, random)
- ✅ Message encryption (demonstration level)
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

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

To verify installation, run:
```bash
node --version
npm --version
```

### Step 1: Extract the Project

1. Extract the `securechat-project.zip` file to your desired location
2. Open a terminal/command prompt

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd securechat-project/backend
```

2. Install backend dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

You should see:
```
Server running on port 3001
WebSocket: ws://localhost:3001
HTTP API: http://localhost:3001/api
```

**Keep this terminal window open** - the backend server needs to keep running.

### Step 3: Frontend Setup

1. Open a **new terminal window/tab**

2. Navigate to the frontend directory:
```bash
cd securechat-project/frontend
```

3. Install frontend dependencies (this may take a few minutes):
```bash
npm install
```

If you encounter network issues, try:
```bash
npm install --registry https://registry.npmjs.org/
```

4. Start the frontend application:
```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

If it doesn't open automatically, manually navigate to: **http://localhost:3000**

## 📖 Usage Guide

### 1. Registration

- Click **"Create Account"**
- Enter username (minimum 3 characters)
- Enter password (minimum 6 characters)
- Click **"Register"**
- You'll be redirected to the login page

### 2. Login

- Enter your username
- Enter your password
- Click **"Login"**
- You'll be connected to the chat interface

### 3. Chatting

- Select a chat room from the sidebar (general, tech, or random)
- Type your message in the input box at the bottom
- Press **Enter** or click **"Send"**
- Messages are encrypted automatically

### 4. Testing with Multiple Users

To test the real-time chat functionality:

1. Open multiple browser tabs or windows
2. Register different accounts in each tab
3. Login with different users
4. Join the same chat room
5. Send messages and see them appear in real-time across all tabs

## 🔐 Security Features

### Password Security
- Passwords are hashed using SHA-256
- Each user gets a unique salt (16 bytes)
- Salts are randomly generated
- Password + Salt are combined before hashing
- Plain passwords are never stored

### Message Encryption
- Messages encrypted with XOR + Base64
- Shared key encryption (demonstration level)
- Encrypted before transmission
- Decrypted only by recipients

### Authentication
- Session token generated on login
- WebSocket requires authentication
- Unauthorized connections rejected

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **WebSocket (ws)** - Real-time communication
- **Crypto** - Built-in Node.js encryption
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **Lucide React** - Icon library
- **Native WebSocket API** - Real-time connection
- **CSS3** - Styling

## 🐛 Troubleshooting

### Backend won't start

**Problem:** Port 3001 is already in use
```bash
# On macOS/Linux
lsof -ti:3001 | xargs kill -9

# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Problem:** Dependencies not installed
```bash
cd backend
npm install
```

**Problem:** Node.js version too old
- Update Node.js to v14 or higher

### Frontend won't start

**Problem:** Port 3000 is already in use
- The terminal will ask if you want to use a different port
- Type `Y` and press Enter

**Problem:** Dependencies installation fails
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install --registry https://registry.npmjs.org/
```

**Problem:** Module not found errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't connect to backend

**Problem:** Backend is not running
- Ensure the backend server is running on port 3001
- Check the backend terminal for any errors

**Problem:** CORS errors
- Make sure you're accessing the frontend via `http://localhost:3000`
- Don't use `127.0.0.1` or other IP addresses

### Can't register user

**Error:** "Username must be at least 3 characters"
- Use a username with 3 or more characters

**Error:** "Password must be at least 6 characters"
- Use a password with 6 or more characters

**Error:** "Username already exists"
- Choose a different username
- Or restart the backend server (data is stored in memory)

### Messages not appearing

**Problem:** Not connected to server
- Check the connection status indicator (top right)
- Ensure backend is running
- Refresh the page and login again

**Problem:** In different rooms
- Make sure all users are in the same chat room

## 🔄 Stopping the Application

### To stop the backend:
1. Go to the terminal running the backend
2. Press `Ctrl + C`

### To stop the frontend:
1. Go to the terminal running the frontend
2. Press `Ctrl + C`

## 📝 Development Notes

### In-Memory Storage
Currently using in-memory storage for users. This means:
- All user data is lost when the server restarts
- Not suitable for production use

For production, consider:
- MongoDB, PostgreSQL, or MySQL for user storage
- Redis for session management
- Proper database migrations

### Encryption Level
Current encryption is for **demonstration purposes only**.

For production-grade security:
- Implement proper key exchange (Diffie-Hellman)
- Use AES-256 encryption
- Add forward secrecy
- Implement per-user key pairs
- Use established libraries like `libsodium` or `crypto-js`

## 🚢 Deployment (Optional)

### Backend Deployment (Render, Railway, Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Note the deployed backend URL

### Frontend Deployment (Vercel, Netlify)
1. Update `serverUrl` in `src/App.js` to your deployed backend URL
2. Push to GitHub
3. Connect repository to hosting platform
4. Deploy

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

## ⚠️ Security Disclaimer

This application is designed for **educational and demonstration purposes**. The encryption implementation is not production-ready and should not be used for sensitive communications. For production use, implement proper cryptographic protocols and security best practices.

---

**Enjoy chatting! 💬**

For issues or questions, please check the troubleshooting section above.
