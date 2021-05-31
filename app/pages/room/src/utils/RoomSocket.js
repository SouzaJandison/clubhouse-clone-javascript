import { constants } from '../../../shared/constants.js';
import SocketBuilder from '../../../shared/SocketBuilder.js';

export default class RoomSocketBuilder extends SocketBuilder{
  constructor({ socketUrl, namespace }) {
    super({ socketUrl, namespace });
    this.onRoomUpdate = () => {};
    this.onUserProfileUpgrade = () => {};
    this.onSpeakRequest = () => {};
  }

  setOnRoomUpdate(fn) {
    this.onRoomUpdate = fn;

    return this;
  }

  setOnUserProfileUpgrade(fn) {
    this.onUserProfileUpgrade = fn;

    return this;
  }

  setOnSpeakRequest(fn) {
    this.onSpeakRequest = fn;

    return this;
  }

  build() {
    const socket = super.build();

    socket.on(constants.events.LOBBY_UPDATED, this.onRoomUpdate);
    socket.on(constants.events.UPGRADE_USER_PERMISSION, this.onUserProfileUpgrade);
    socket.on(constants.events.SPEAK_REQUEST, this.onSpeakRequest);

    return socket;
  }
}