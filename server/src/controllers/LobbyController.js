import { constants } from "../utils/constants.js";

export default class LobbyController {
  constructor({ activeRooms, roomsListener }) {
    this.activeRooms = activeRooms;
    this.roomsListener = roomsListener;
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('[LOBBY] connection stablished with', id);
    this.#updateLobbyRooms(socket, [...this.activeRooms.values()]);
  }

  #updateLobbyRooms(socket, activeRooms) {
    socket.emit(constants.events.LOBBY_UPDATED, activeRooms);
  }

  getEvents() {
    const functions = Reflect.ownKeys(LobbyController.prototype)
      .filter(fn => fn !== 'constructor')
      .map(name => [name, this[name].bind(this)]);

    return new Map(functions);
  }
}