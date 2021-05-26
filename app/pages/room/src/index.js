import { constants } from "../../shared/constants.js";
import RoomController from "./utils/RoomController.js";
import RoomSocketBuilder from "./utils/RoomSocket.js";
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

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
});

const dependencies = { 
  socketBuilder, 
  roomInfo, 
  view: View 
};

await RoomController.initialize(dependencies);