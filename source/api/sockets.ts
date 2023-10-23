import io from 'socket.io-client';
import {apiUrl} from './serverRequests';

const socket = io(apiUrl, {
  transports: ['websocket'],
  autoConnect: true,
}).connect();

export default socket;
