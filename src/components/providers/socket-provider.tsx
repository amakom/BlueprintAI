'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { io as ClientIO, Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  connectionError: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch auth token before connecting
    const initSocket = async () => {
      try {
        // Get auth token from API
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          console.log('Socket: User not authenticated, skipping connection');
          return;
        }

        const data = await res.json();
        if (!data.user) {
          console.log('Socket: No user session, skipping connection');
          return;
        }

        // Get token from cookie (or we could return it from /api/auth/me)
        // For now, we'll create a socket token endpoint
        const tokenRes = await fetch('/api/auth/socket-token');
        const tokenData = await tokenRes.json();

        if (!tokenData.token) {
          console.log('Socket: No socket token available');
          return;
        }

        const socketInstance = new (ClientIO as any)(
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin,
          {
            path: '/api/socket/io',
            addTrailingSlash: false,
            auth: {
              token: tokenData.token,
            },
          }
        );

        socketInstance.on('connect', () => {
          console.log('Socket connected');
          setIsConnected(true);
          setConnectionError(null);
        });

        socketInstance.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error.message);
          setConnectionError(error.message);
          setIsConnected(false);
        });

        socketInstance.on('error', (data: { message: string }) => {
          console.error('Socket error:', data.message);
          setConnectionError(data.message);
        });

        setSocket(socketInstance);

        return () => {
          socketInstance.disconnect();
        };
      } catch (error) {
        console.error('Failed to initialize socket:', error);
      }
    };

    initSocket();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionError }}>
      {children}
    </SocketContext.Provider>
  );
};
