import { constants } from "../../../shared/constants.js";
import Attendee from '../entities/Attendee.js';

export default class RoomController {
  constructor({ socketBuilder, roomInfo, view }) {
    this.socketBuilder = socketBuilder;
    this.roomInfo = roomInfo;
    this.view = view;

    this.socket = {};
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  async _initialize() {
    this._setupViewEvents();

    this.socket = this._setupSocket();

    this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdate(this.onRoomUpdate())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .build();
  }

  onUserConnected() {
    return data => {
      const attendee = new Attendee(data)
      console.log(`${attendee.username}, Connection!`);
      this.view.addAttendeeOnGrid(attendee);
    }
  }

  onUserDisconnected() {
    return data => {
      const attendee = new Attendee(data);
      console.log(`${attendee.username}, Disconnection!`);
      this.view.removeItemFromGrid(attendee.id);
      
    }
  }

  onRoomUpdate() {
    return room => {
      console.log('room list!', room);
      this.view.updateAttendeesOnGrid(room);
    }
  }

  onUserProfileUpgrade() {
    return data => {
      const attendee = new Attendee(data);
      console.log('user', attendee);

      if(attendee.isSpeaker) {
        this.view.addAttendeeOnGrid(attendee, true);
      }
    }
  }
} 