import { constants } from '../../../shared/constants.js';
import SocketBuilder from '../../../shared/SocketBuilder.js';

export default class RoomSocketBuilder extends SocketBuilder{
  constructor({ socketUrl, namespace }) {
    super({ socketUrl, namespace });
    this.onRoomUpdate = () => {};
  }

  setOnRoomUpdate(fn) {
    this.onRoomUpdate = fn;

    return this;
  }

  build() {
    const socket = super.build();

    socket.on(constants.events.LOBBY_UPDATED, this.onRoomUpdate);

    return socket;
  }
}