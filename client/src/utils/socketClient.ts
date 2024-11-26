import { io, Socket } from 'socket.io-client';
import API from '@/constants/api';

let socket: Socket | null = null;

export const initiateSocketConnection = () => {
  if (!socket) {
    const endpoint = API.BE;
    if (!endpoint) {
      console.error('NEXT_PUBLIC_SOCKET_ENDPOINT không được định nghĩa!');
      return;
    }
    console.log('Socket endpoint:', endpoint); // Debugging
    socket = io(endpoint, {
      withCredentials: true,
    });
    console.log('Connecting socket...');
  }
};
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('Disconnecting socket...');
    socket = null;
  }
};

interface SeatStatus {
  seatId: string;
  status: string;
  heldBy: string;
}

export const subscribeToSeatStatus = (callback: (data: SeatStatus) => void) => {
  if (!socket) return;
  socket.on('seatStatusChanged', (data: SeatStatus) => {
    console.log('Seat status changed:', data);
    callback(data);
  });
};
