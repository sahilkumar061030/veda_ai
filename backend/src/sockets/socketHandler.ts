import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/types';

let io: SocketIOServer | null = null;

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'vedaai-dev-secret'
      ) as JwtPayload;
      (socket as any).user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user as JwtPayload;
    console.log(`🔌 Socket connected: ${user.email} (${socket.id})`);

    // Join user-specific room
    socket.join(`user:${user.userId}`);

    // Handle status check request
    socket.on('check:status', (data: { assignmentId: string }) => {
      // Client can request status updates
      console.log(`Status check requested for: ${data.assignmentId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${user.email} (${reason})`);
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

export default { initializeSocket, getIO };
