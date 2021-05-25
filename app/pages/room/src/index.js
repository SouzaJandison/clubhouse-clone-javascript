import { constants } from "../../shared/constants.js";
import RoomSocketBuilder from "./utils/RoomSocket.js";

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room
});

const socket = socketBuilder
  .setOnUserConnected(user => console.log('User connection!', user))
  .setOnUserDisconnected(user => console.log('User connection!', user))
  .setOnRoomUpdate(room => console.log('room list!', room))
  .build();

const room = {
  id: '0001',
  topic: 'qualquer coisa',
}

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png',
  username: 'Jandison Barbosa' + Date.now(),
}

socket.emit(constants.events.JOIN_ROOM, { user, room });
