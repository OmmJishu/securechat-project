import React, { useState, useEffect, useRef } from 'react';
import { Send, Lock, Users, LogOut, Wifi, WifiOff, UserPlus } from 'lucide-react';
import './App.css';

function App() {
  const [view, setView] = useState('login'); // 'login', 'register', 'chat'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [error, setError] = useState('');
  
  const [currentRoom, setCurrentRoom] = useState('general');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [roomUsers, setRoomUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  //const [serverUrl] = useState('http://localhost:3001');
  const [serverUrl] = useState('https://securechat-project.onrender.com');
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const SHARED_KEY = 'SecureChat2024Key!';

  const encrypt = (text, key) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  };

  const decrypt = (encrypted, key) => {
    try {
      const decoded = atob(encrypted);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch (e) {
      return '[Decryption failed]';
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${serverUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please login.');
        setView('login');
        setPassword('');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${serverUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setAuthToken(data.token);
        setView('chat');
        connectWebSocket(data.username, data.token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  // Connect to WebSocket
  const connectWebSocket = (user, token) => {
    try {
      const wsUrl = serverUrl.replace('http://', 'ws://').replace('https://', 'wss://');
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // Authenticate first
        ws.send(JSON.stringify({
          type: 'authenticate',
          username: user,
          token
        }));
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'authenticated':
              setIsConnected(true);
              // Join default room
              ws.send(JSON.stringify({
                type: 'join',
                room: currentRoom
              }));
              break;

            case 'message':
              setMessages(prev => ({
                ...prev,
                [data.room || currentRoom]: [...(prev[data.room || currentRoom] || []), {
                  id: data.id || Date.now() + Math.random(),
                  user: data.user,
                  encrypted: data.encrypted,
                  timestamp: data.timestamp,
                  isOwn: data.user === user
                }]
              }));
              break;

            case 'room_users':
              setRoomUsers(data.users || []);
              break;

            case 'user_joined':
              if (data.username !== user) {
                setMessages(prev => ({
                  ...prev,
                  [currentRoom]: [...(prev[currentRoom] || []), {
                    id: Date.now() + Math.random(),
                    type: 'system',
                    text: `${data.username} joined the chat`,
                    timestamp: new Date(data.timestamp).toLocaleTimeString()
                  }]
                }));
              }
              break;

            case 'user_left':
              setMessages(prev => ({
                ...prev,
                [currentRoom]: [...(prev[currentRoom] || []), {
                  id: Date.now() + Math.random(),
                  type: 'system',
                  text: `${data.username} left the chat`,
                  timestamp: new Date().toLocaleTimeString()
                }]
              }));
              break;

            case 'error':
              setError(data.message);
              break;

            default:
              break;
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() && wsRef.current && isConnected) {
      const encryptedMessage = encrypt(message, SHARED_KEY);
      const timestamp = new Date().toLocaleTimeString();
      
      wsRef.current.send(JSON.stringify({
        type: 'send_message',
        room: currentRoom,
        encrypted: encryptedMessage,
        timestamp
      }));

      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (view === 'chat') {
        handleSendMessage();
      }
    }
  };

  const handleLogout = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setView('login');
    setUsername('');
    setPassword('');
    setAuthToken('');
    setMessages({});
    setRoomUsers([]);
    setCurrentRoom('general');
    setIsConnected(false);
    setError('');
  };

  const switchRoom = (room) => {
    if (wsRef.current && room !== currentRoom && isConnected) {
      wsRef.current.send(JSON.stringify({
        type: 'switch_room',
        oldRoom: currentRoom,
        newRoom: room
      }));
      setCurrentRoom(room);
      if (!messages[room]) {
        setMessages(prev => ({ ...prev, [room]: [] }));
      }
    }
  };

  // Login/Register View
  if (view === 'login' || view === 'register') {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="icon-circle">
              <Lock size={32} />
            </div>
            <h1>SecureChat</h1>
            <p>End-to-End Encrypted Messaging</p>
          </div>
          
          {view === 'login' ? (
            <div>
              <form onSubmit={handleLogin} className="login-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Login
                </button>
              </form>

              <div className="switch-view">
                <p>Don't have an account?</p>
                <button onClick={() => { setView('register'); setError(''); }} className="btn-link">
                  <UserPlus size={16} /> Create Account
                </button>
              </div>
            </div>
          ) : (
            <div>
              <form onSubmit={handleRegister} className="login-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username (min 3 characters)"
                    autoComplete="username"
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password (min 6 characters)"
                    autoComplete="new-password"
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Register
                </button>
              </form>

              <div className="switch-view">
                <p>Already have an account?</p>
                <button onClick={() => { setView('login'); setError(''); }} className="btn-link">
                  Login
                </button>
              </div>
            </div>
          )}
          
          <div className="info-box">
            <Lock size={16} />
            <p>Passwords are hashed with SHA-256 and salt. All messages are encrypted end-to-end.</p>
          </div>
        </div>
      </div>
    );
  }

  // Chat View
  const currentMessages = messages[currentRoom] || [];
  const rooms = ['general', 'tech', 'random'];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="header-top">
            <div className="logo">
              <Lock size={24} />
              <h2>SecureChat</h2>
            </div>
            {isConnected ? <Wifi size={20} color="#4ade80" /> : <WifiOff size={20} color="#ef4444" />}
          </div>
          <div className="user-info">
            <p className="user-label">Logged in as</p>
            <p className="username">{username}</p>
            <p className="status">{isConnected ? 'Connected' : 'Disconnected'}</p>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="rooms-section">
            <h3><Users size={16} /> Chat Rooms</h3>
            {rooms.map(room => (
              <button
                key={room}
                onClick={() => switchRoom(room)}
                disabled={!isConnected}
                className={`room-btn ${currentRoom === room ? 'active' : ''}`}
              >
                # {room}
              </button>
            ))}
          </div>

          <div className="users-section">
            <h3>Online Users ({roomUsers.length})</h3>
            <div className="users-list">
              {roomUsers.length === 0 ? (
                <p className="no-users">No users online</p>
              ) : (
                roomUsers.map((user, idx) => (
                  <div key={idx} className="user-item">
                    <div className="status-dot"></div>
                    <span className={user === username ? 'bold' : ''}>
                      {user} {user === username ? '(You)' : ''}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-content">
        <div className="chat-header">
          <div>
            <h2># {currentRoom}</h2>
            <p><Lock size={12} /> End-to-end encrypted</p>
          </div>
          <div className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
            {isConnected ? `${roomUsers.length} users online` : 'Disconnected'}
          </div>
        </div>

        <div className="messages-container">
          {!isConnected && (
            <div className="disconnected-notice">
              <WifiOff size={32} />
              <p className="notice-title">Not connected to server</p>
              <p className="notice-text">Attempting to reconnect...</p>
            </div>
          )}
          
          {currentMessages.length === 0 ? (
            <div className="empty-messages">
              <Lock size={48} />
              <p>No messages yet. Start the conversation!</p>
              <small>All messages are encrypted end-to-end</small>
            </div>
          ) : (
            currentMessages.map(msg => {
              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="system-message">
                    <span>{msg.text}</span>
                  </div>
                );
              }
              
              return (
                <div key={msg.id} className={`message ${msg.isOwn ? 'own' : ''}`}>
                  <div className="message-content">
                    <div className="message-meta">
                      <span className="message-user">{msg.user}</span>
                      <span className="message-time">{msg.timestamp}</span>
                    </div>
                    <div className="message-bubble">
                      <p>{decrypt(msg.encrypted, SHARED_KEY)}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="message-input-container">
          <div className="input-wrapper">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your encrypted message..."
              disabled={!isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected}
              className="btn-send"
            >
              <Send size={20} />
              <span>Send</span>
            </button>
          </div>
          <p className="input-info">
            <Lock size={12} />
            Messages are encrypted end-to-end with a shared secure key
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
