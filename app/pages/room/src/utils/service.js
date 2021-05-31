import UserStream from "../entities/UserStream.js";

export default class RoomService {
  constructor({ media }) {
    this.media = media;

    this.currentPeer = {};
    this.currentUser = {};
    this.currentStream = {};

    this.peers = new Map();
  }

  async init() {
    this.currentStream = new UserStream({
      stream: await this.media.getUserAudio(),
      isFake: false,
    })
  }

  setCurrentPeer(peer) {
    this.currentPeer = peer;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async upgradeUserPermission(user) {
    if(!user.isSpeaker) return;

    const isCurrentUser = user.id === this.currentUser.id;
    if(!isCurrentUser) return;
    this.currentUser = user;

    return this._reconnectAsSpeaker();
  }

  async _reconnectAsSpeaker() {
    return this.swithAudioStreamSource({ realAudio: true });
  }

  _reconnectPeers(stream) {
    for(const peer of this.peers.values()) {
      const peerId = peer.call.peer;
      peer.call.close();
      console.log('calling', peerId);

      this.currentPeer.call(peerId, stream);

      this._reconnectPeers(this.currentStream.stream);
    }
  }

  async swithAudioStreamSource({ realAudio }) {
    const userAudio = realAudio
      ? await this.media.getUserAudio()
      : this.media.createMediaStreamFake()

    this.currentStream = new UserStream({
      isFake: realAudio,
      stream: userAudio,
    });

    this.currentUser.isSpeaker = realAudio;
  }

  updateCurrentUserProfile(users) {
    console.log('find', users);
    this.currentUser = users.find(({ peerId }) => peerId === this.currentPeer.id);
  }

  async getCurrentStream() {
    const { isSpeaker } = this.currentUser;

    if(isSpeaker) {
      return this.currentStream.stream;
    }

    return this.media.createMediaStreamFake();
  }

  addReceivedPeer(call) {
    const calledId = call.peer;

    this.peers.set(calledId, { call });

    const isCurrentId = calledId === this.currentUser.id;

    return { isCurrentId };
  }

  disconnectPeer({ peerId }) {
    if(!this.peers.has(peerId)) return;

    this.peers.get(peerId).call.close();
    this.peers.delete(peerId);
  }

  async callNewUser(user) {
    const { isSpeaker } = this.currentUser;

    if(!isSpeaker) return;

    const stream = await this.getCurrentStream();

    this.currentPeer.call(user.peerId, stream);
  }
}