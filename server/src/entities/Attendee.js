export default class Attendde {
  constructor({ id, username, img, isSpeaker, roomId, peerId }) {
    this.id = id;
    this.username = username;
    this.img = img;
    this.isSpeaker = isSpeaker;
    this.roomId = roomId;
    this.peerId  = peerId;
  }
}