import io from 'socket.io-client';
import {axiosInstance} from '../utils/helpers';

const socket = io(axiosInstance.getUri(), {
  transports: ['websocket'],
  autoConnect: true,
}).connect();

export default socket;

// export const connectSocket = (subscribeMessage: string, eventHandlers: any) =>
//   eventChannel(emitter => {
//     return () =>
//       socket.on(subscribeMessage, eventHandlers).off(subscribeMessage);
//   });
