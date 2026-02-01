import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      socket.on('join-project', (projectId: string) => {
        socket.join(projectId);
        console.log(`Socket ${socket.id} joined project ${projectId}`);
      });

      socket.on('cursor-move', (data) => {
        socket.to(data.projectId).emit('cursor-move', data);
      });

      socket.on('node-change', (data) => {
        socket.to(data.projectId).emit('node-change', data);
      });

      socket.on('edge-change', (data) => {
        socket.to(data.projectId).emit('edge-change', data);
      });

      socket.on('node-add', (data) => {
        socket.to(data.projectId).emit('node-add', data);
      });

      socket.on('edge-add', (data) => {
        socket.to(data.projectId).emit('edge-add', data);
      });

      socket.on('comment-add', (data) => {
        socket.to(data.projectId).emit('comment-add', data);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
