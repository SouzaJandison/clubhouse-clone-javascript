import Attendde from "../entities/Attendee.js";
import Room from '../entities/Room.js'
import { constants } from "../utils/constants.js";

export default class RoomsController {
  #users = new Map();

  constructor() {
    this.rooms = new Map();
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log('connection stablished with ', id);
    this.#updateGlobalUserData(id);
  }

  joinRoom(socket, { user, room }) {
    const userId = user.id = socket.id;
    const roomId = room.id;

    const updateUserData = this.#updateGlobalUserData(userId, user, roomId);

    const updateRoom = this.#joinUserRoom(
      socket,
      updateUserData,
      room,
    );

    this.#notifyUserOnRoom(socket, roomId, updateUserData);
    this.#replyWithActiveUsers(socket, updateRoom.users);
  }

  #replyWithActiveUsers(socket, users) {
    const event = constants.events.LOBBY_UPDATED;

    socket.emit(event, [...users.values()]);
  }

  #notifyUserOnRoom(socket, roomId, user) {
    const event = constants.events.USER_CONNECTED;

    socket.to(roomId).emit(event, user);
  }

  #joinUserRoom(socket, user, room) {
    const roomId = room.id;
    const existingRoom = this.rooms.has(roomId);
    const correntRomm = existingRoom ? this.rooms.get(roomId) : {};
    const correntUser = new Attendde({
      ...user,
      roomId
    });

    const [owner, users] = existingRoom
      ? [correntRomm.owner, correntRomm.users]
      : [correntUser, new Set()];

    const updateRoom = this.#mapRoom({
      ...correntRomm,
      ...room,
      owner,
      users: new Set([...users, ...[correntUser]]),
    });

    this.rooms.set(roomId, updateRoom);

    socket.join(roomId);

    return this.rooms.get(roomId);
  }

  #mapRoom(room) {
    const users = [...room.users.values()];
    const speakersCounts =  users.filter(user => user.isSpeaker).length;
    const featuredAttenddes = users.slice(0, 3);

    const mappedRoom = new Room({
      ...room,
      featuredAttenddes,
      speakersCounts,
      attenddesCount: room.users.size
    });

    return mappedRoom;
  }

  #updateGlobalUserData(userId, userData = {}, roomId = '') {
    const user = this.#users.get(userId) ?? {};
    const existingRoom = this.rooms.has(roomId);

    const updateUserData = new Attendde({
      ...user,
      ...userData,
      roomId,
      isSpeaker: !existingRoom
    });

    this.#users.set(userId, updateUserData);

    return this.#users.get(userId);
  }

  getEvents() {
    const functions = Reflect.ownKeys(RoomsController.prototype)
      .filter(fn => fn !== 'constructor')
      .map(name => [name, this[name].bind(this)]);

    return new Map(functions);
  }
}