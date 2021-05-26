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

  disconnect(socket) {
    console.log('disconnection', socket.id);
    this.#logoutUser(socket);
  }

  #logoutUser(socket) {
    const userId = socket.id;
    const user = this.#users.get(userId);
    const roomId = user.roomId

    this.#users.delete(userId);
    
    if(!this.rooms.has(roomId)) return;

    const room = this.rooms.get(roomId);
    const toBeRemoved = [...room.users].find(({ id }) => id === userId);
    room.users.delete(toBeRemoved);

    if(!room.users.size) {
      this.rooms.delete(roomId);
      return;
    }

    const disconnectedUserWasAnOwner = userId === room.owner.id;
    const onlyOneUserLeft = room.users.size === 1;

    if(disconnectedUserWasAnOwner || onlyOneUserLeft) {
      room.owner = this.#getNewRoomOwner(room, socket)
    }

    this.rooms.set(roomId, room);

    socket.to(roomId).emit(constants.events.USER_DISCONNECT, user);
  }

  #notifyUserProfileUpgrade(socket, roomId, user) {
    console.log(roomId);
    socket.to(roomId).emit(constants.events.UPGRADE_USER_PERMISSION, user);
  }

  #getNewRoomOwner(room, socket) {
    const users = [...room.users.values()];
    const activeSpeakers = users.find(user => user.isSpeaker);

    const [newOwner] = activeSpeakers ? [activeSpeakers] : users;
    newOwner.isSpeaker = true;

    const outdateUser = this.#users.get(newOwner.id);

    const updateUser = new Attendde({
      ...outdateUser,
      ...newOwner,
    });

    this.#users.set(newOwner.id, updateUser);

    this.#notifyUserProfileUpgrade(socket, room.id, newOwner);

    return newOwner;
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
    const speakersCount =  users.filter(user => user.isSpeaker).length;
    const featuredAttenddes = users.slice(0, 3);

    const mappedRoom = new Room({
      ...room,
      featuredAttenddes,
      speakersCount,
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