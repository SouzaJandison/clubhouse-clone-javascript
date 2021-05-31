import { constants } from "../../shared/constants.js";
import Media from "../../shared/media.js";
import PeerBuilder from "../../shared/peerBuilder.js";
import RoomController from "./utils/RoomController.js";
import RoomSocketBuilder from "./utils/RoomSocket.js";
import RoomService from "./utils/service.js";
import View from "./utils/View.js";

const urlParams = new URLSearchParams(window.location.search);
const keys = ['id', 'topic'];

const urlData = keys.map(key => [key, urlParams.get(key)]);

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png',
  username: 'Jandison Barbosa' + Date.now(),
}

const roomInfo = {
  room: { ...Object.fromEntries(urlData) },
  user
}

const peerBuilder = new PeerBuilder({
  peerConfig: constants.peerConfig,
});

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
});

const roomService = new RoomService({
  media: Media,
});

const dependencies = { 
  socketBuilder, 
  roomInfo, 
  view: View, 
  peerBuilder,
  roomService,
};

RoomController.initialize(dependencies).catch(err => alert(err.message));