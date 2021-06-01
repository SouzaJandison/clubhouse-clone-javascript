import { constants } from "../../../shared/constants.js";
import Attendee from '../entities/Attendee.js';

export default class RoomController {
  constructor({ socketBuilder, roomInfo, view, peerBuilder, roomService }) {
    this.socketBuilder = socketBuilder;
    this.roomInfo = roomInfo;
    this.view = view;
    this.peerBuilder = peerBuilder;
    this.roomService = roomService;

    this.socket = {};
    this.peer = {};
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  async _initialize() {
    this._setupViewEvents();
    await this.roomService.init();

    this.socket = this._setupSocket();
    this.roomService.setCurrentPeer(await this._setupWebRTC());
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
    this.view.configureClapButton(this.onClapPressed());
    this.view.configureLeaveButton();
    this.view.cofigureOnMicrophoneActivation(this.onMicrophoneActivation());
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onUserDisconnected())
      .setOnRoomUpdate(this.onRoomUpdate())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .setOnSpeakRequest(this.onSpeakRequest())
      .build();
  }

  async _setupWebRTC() {
    return this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onCallReceived())
      .setOnCallError(this.onCallError())
      .setOnCallClose(this.onCallClose())
      .setOnStreamReceived(this.onStreamReceived())
      .build();
  }

  onClapPressed() {
    return () => {
      this.socket.emit(constants.events.SPEAK_REQUEST, this.roomInfo.user)
    }
  }

  onMicrophoneActivation() {
    return async () => {
      await this.roomService.toggleAudioActivation();
    };
  }

  onPeerError() {
    return error => console.log('Error Peer, deu ruim!', error)
  }

  onPeerConnectionOpened() {
    return peer => {
      console.log('peeeer', peer);
      this.roomInfo.user.peerId = peer.id
      this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
    }
  }

  onCallReceived() {
    return async call => {
      const stream = await this.roomService.getCurrentStream()
      console.log('answering call', call);
      call.answer(stream)
    }
  }

  onCallError() {
    return (call, error) => {
      console.log('onCallError', call, error);
      const peerId = call.peer
      this.roomService.disconnectPeer({ peerId });
    }
  }

  onCallClose() {
    return call => {
      console.log('onCallClose', call);
      const peerId = call.peer
      this.roomService.disconnectPeer({ peerId });
    }
  }

  onStreamReceived() {
    return (call, stream) => {
      console.log('onStreamReceived', call, stream);

      const { isCurrentId } = this.roomService.addReceivedPeer(call);
      this.view.renderAudioElement({
        stream,
        isCurrentId,
      });
    }
  }

  onUserConnected() {
    return data => {
      const attendee = new Attendee(data)
      console.log(`${attendee.username}, Connection!`);
      this.view.addAttendeeOnGrid(attendee);
      this.roomService.callNewUser(attendee);
    }
  }

  onUserDisconnected() {
    return data => {
      const attendee = new Attendee(data);
      console.log(`${attendee.username}, Disconnection!`);
      this.view.removeItemFromGrid(attendee.id);
      
      this.roomService.disconnectPeer(attendee);
    }
  }

  onRoomUpdate() {
    return data => {
      console.log('data', data);
      const users = data.map(item => new Attendee(item));
      console.log('room list!', users);
      this.view.updateAttendeesOnGrid(users);
      this.roomService.updateCurrentUserProfile(users);
      this.activateUserFeatures();
    }
  }

  onUserProfileUpgrade() {
    return data => {
      const attendee = new Attendee(data);
      console.log('onUserProfileUpgrade', attendee);

      if(attendee.isSpeaker) {
        this.roomService.upgradeUserPermission(attendee);
        this.view.addAttendeeOnGrid(attendee, true);
      }
      
      this.activateUserFeatures();
    }
  }

  onSpeakRequest() {
    return data => {
      const user = new Attendee(data);
      const result = prompt(`${user.username} pediu para falar! Aceitar? 1 Sim, 0 Não`);
      this.socket.emit(constants.events.SPEAK_ANSWER, { answer: !!Number(result), user });
    }
  }

  activateUserFeatures() {
    const currentUser = this.roomService.getCurrentUser();
    this.view.showUserFeatures(currentUser.isSpeaker);
  }
} 