import { Server as SocketIOServer } from 'socket.io';
import { Server } from 'http';

class SocketSingleton {
  private static instance: SocketIOServer;

  public static init(httpServer: Server): SocketIOServer {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = new SocketIOServer(httpServer, {
        cors: {
          origin: process.env.FRONTEND_URL,
          credentials: true,
        },
      });
    }
    return SocketSingleton.instance;
  }

  public static getInstance(): SocketIOServer {
    if (!SocketSingleton.instance) {
      throw new Error('Socket instance not initialized');
    }
    return SocketSingleton.instance;
  }
}

export default SocketSingleton;
