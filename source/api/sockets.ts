import io from 'socket.io-client';
import {apiUrl} from './serverRequests';
// import {eventChannel} from 'redux-saga';

const socket = io(apiUrl, {
  transports: ['websocket'],
  autoConnect: true,
}).connect();

export default socket;

// export const connectSocket = (subscribeMessage: string, eventHandlers: any) =>
//   eventChannel(emitter => {
//     return () =>
//       socket.on(subscribeMessage, eventHandlers).off(subscribeMessage);
//   });
