import {io} from 'socket.io-client';
const socket = io('https://dance-connect-528e8b559e89.herokuapp.com', {
  autoConnect: true,
});
// const socket = io('http://localhost:3000', {
//   autoConnect: true,
// });
export default socket;
