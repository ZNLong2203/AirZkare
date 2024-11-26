import { Server as SocketIOServer } from 'socket.io';

export interface Routes {
  path?: string;
  router?: any;
}