import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO, Socket } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/next';
import { verifyToken } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Extend Socket type to include user data
interface AuthenticatedSocket extends Socket {
  data: {
    userId?: string;
    email?: string;
    role?: string;
  };
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    // Authentication middleware
    io.use(async (socket: AuthenticatedSocket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          console.log('Socket connection rejected: No token provided');
          return next(new Error('Authentication required'));
        }

        const session = await verifyToken(token);
        if (!session) {
          console.log('Socket connection rejected: Invalid token');
          return next(new Error('Invalid or expired token'));
        }

        // Attach user data to socket
        socket.data.userId = session.userId;
        socket.data.email = session.email;
        socket.data.role = session.role;

        console.log(`Socket authenticated: User ${session.userId}`);
        next();
      } catch (error) {
        console.error('Socket auth error:', error);
        next(new Error('Authentication failed'));
      }
    });

    io.on('connection', (socket: AuthenticatedSocket) => {
      console.log('Socket connected:', socket.id, 'User:', socket.data.userId);

      socket.on('join-project', async (projectId: string) => {
        try {
          if (!socket.data.userId) {
            socket.emit('error', { message: 'Not authenticated' });
            return;
          }

          // Verify user has access to this project
          const membership = await prisma.teamMember.findFirst({
            where: {
              userId: socket.data.userId,
              team: {
                projects: {
                  some: { id: projectId }
                }
              }
            }
          });

          if (!membership) {
            console.log(`Socket ${socket.id} denied access to project ${projectId}`);
            socket.emit('error', { message: 'Access denied to this project' });
            return;
          }

          socket.join(projectId);
          console.log(`Socket ${socket.id} (User: ${socket.data.userId}) joined project ${projectId}`);

          // Notify others in the room
          socket.to(projectId).emit('user-joined', {
            userId: socket.data.userId,
            socketId: socket.id
          });
        } catch (error) {
          console.error('Error joining project:', error);
          socket.emit('error', { message: 'Failed to join project' });
        }
      });

      socket.on('leave-project', (projectId: string) => {
        socket.leave(projectId);
        socket.to(projectId).emit('user-left', {
          userId: socket.data.userId,
          socketId: socket.id
        });
        console.log(`Socket ${socket.id} left project ${projectId}`);
      });

      socket.on('cursor-move', (data) => {
        if (!data.projectId) return;
        socket.to(data.projectId).emit('cursor-move', {
          ...data,
          userId: socket.data.userId
        });
      });

      socket.on('node-change', (data) => {
        if (!data.projectId) return;
        socket.to(data.projectId).emit('node-change', {
          ...data,
          userId: socket.data.userId
        });
      });

      socket.on('edge-change', (data) => {
        if (!data.projectId) return;
        socket.to(data.projectId).emit('edge-change', {
          ...data,
          userId: socket.data.userId
        });
      });

      socket.on('node-add', (data) => {
        if (!data.projectId) return;
        socket.to(data.projectId).emit('node-add', {
          ...data,
          userId: socket.data.userId
        });
      });

      socket.on('edge-add', (data) => {
        if (!data.projectId) return;
        socket.to(data.projectId).emit('edge-add', {
          ...data,
          userId: socket.data.userId
        });
      });

      socket.on('comment-add', (data) => {
        if (!data.projectId) return;
        socket.to(data.projectId).emit('comment-add', {
          ...data,
          userId: socket.data.userId
        });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id, 'User:', socket.data.userId);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
