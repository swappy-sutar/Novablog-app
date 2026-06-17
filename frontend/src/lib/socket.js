import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket = null;

export const connectSocket = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  if (socket) {
    if (socket.connected) return socket;
    // Update token if it has changed
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
  });

  socket.on('connect', () => {
    console.log('Socket.io connection established successfully');
  });

  socket.on('disconnect', () => {
    console.log('Socket.io connection disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => {
  return socket;
};
