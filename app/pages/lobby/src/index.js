import { constants } from '../../shared/constants.js';
import LobbyController from './LobbyController.js';
import LobbySocketBuilder from './utils/LobbySocket.js';
import View from './view.js';

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/bear_russian_animal_avatar-256.png',
  username: 'Jandison Barbosa' + Date.now(),
}

const socketBuilder = new LobbySocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.lobby,
});

const dependencies = {
  socketBuilder,
  user,
  view: View
}

LobbyController.initialize(dependencies).catch(err => alert(err.message));