// server.js - Backend Server with Authentication
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// app.use(cors());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));
app.use(express.json());

// In-memory storage (in production, use a database)
const users = new Map(); // username -> { passwordHash, salt }
const activeSessions = new Map(); // ws -> { username, room }
const rooms = new Map(['general', 'tech', 'random'].map(room => [room, new Set()]));

// Password hashing functions
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function hashPassword(password, salt) {
  return crypto
    .createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

function verifyPassword(password, salt, hash) {
  return hashPassword(password, salt) === hash;
}

// REST API Endpoints
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (users.has(username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const salt = generateSalt();
  const passwordHash = hashPassword(password, salt);

  users.set(username, { passwordHash, salt });

  console.log(`User registered: ${username}`);
  res.json({ success: true, message: 'Registration successful' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = users.get(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (!verifyPassword(password, user.salt, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate session token
  const token = crypto.randomBytes(32).toString('hex');

  console.log(`User logged in: ${username}`);
  res.json({ success: true, token, username });
});

// WebSocket connection handling
function broadcast(room, message, excludeWs = null) {
  if (!rooms.has(room)) return;
  
  rooms.get(room).forEach(userWs => {
    if (userWs !== excludeWs && userWs.readyState === WebSocket.OPEN) {
      userWs.send(JSON.stringify(message));
    }
  });
}

function sendRoomUsers(room) {
  if (!rooms.has(room)) return;
  
  const roomUsers = Array.from(rooms.get(room))
    .map(ws => activeSessions.get(ws)?.username)
    .filter(Boolean);

  broadcast(room, {
    type: 'room_users',
    users: roomUsers
  });
}

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  let authenticated = false;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      // First message must be authentication
      if (!authenticated && message.type !== 'authenticate') {
        ws.send(JSON.stringify({ type: 'error', message: 'Must authenticate first' }));
        return;
      }

      switch (message.type) {
        case 'authenticate': {
          const { username, token } = message;
          
          // In production, verify token properly
          if (!users.has(username)) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid authentication' }));
            ws.close();
            return;
          }

          authenticated = true;
          activeSessions.set(ws, { username, room: 'general' });
          
          ws.send(JSON.stringify({ 
            type: 'authenticated', 
            username 
          }));

          console.log(`User authenticated: ${username}`);
          break;
        }

        case 'join': {
          const { room } = message;
          const session = activeSessions.get(ws);
          
          if (!session) return;

          session.room = room;
          
          if (!rooms.has(room)) {
            rooms.set(room, new Set());
          }
          rooms.get(room).add(ws);

          // Notify room about new user
          broadcast(room, {
            type: 'user_joined',
            username: session.username,
            timestamp: new Date().toISOString()
          }, ws);

          sendRoomUsers(room);

          console.log(`${session.username} joined room: ${room}`);
          break;
        }

        case 'send_message': {
          const { room, encrypted, timestamp } = message;
          const session = activeSessions.get(ws);
          
          if (!session) return;

          broadcast(room, {
            type: 'message',
            id: Date.now() + Math.random(),
            user: session.username,
            encrypted,
            timestamp,
            room
          });
          
          console.log(`Message from ${session.username} in ${room}`);
          break;
        }

        case 'switch_room': {
          const { oldRoom, newRoom } = message;
          const session = activeSessions.get(ws);
          
          if (!session) return;

          // Remove from old room
          if (rooms.has(oldRoom)) {
            rooms.get(oldRoom).delete(ws);
            broadcast(oldRoom, {
              type: 'user_left',
              username: session.username,
              timestamp: new Date().toISOString()
            });
            sendRoomUsers(oldRoom);
          }

          // Add to new room
          if (!rooms.has(newRoom)) {
            rooms.set(newRoom, new Set());
          }
          rooms.get(newRoom).add(ws);
          session.room = newRoom;

          // Notify new room
          broadcast(newRoom, {
            type: 'user_joined',
            username: session.username,
            timestamp: new Date().toISOString()
          }, ws);
          sendRoomUsers(newRoom);

          console.log(`${session.username} switched from ${oldRoom} to ${newRoom}`);
          break;
        }

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    const session = activeSessions.get(ws);
    if (session) {
      const { username, room } = session;
      
      // Remove from room
      if (rooms.has(room)) {
        rooms.get(room).delete(ws);
        sendRoomUsers(room);
      }

      broadcast(room, {
        type: 'user_left',
        username,
        timestamp: new Date().toISOString()
      });

      activeSessions.delete(ws);
      console.log(`${username} disconnected`);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
  console.log(`HTTP API: http://localhost:${PORT}/api`);
});
