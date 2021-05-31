import SocketServer from './utils/Socket.js';
import RoomsController from './controllers/RoomsController.js';
import Event from 'events';
import { constants } from './utils/constants.js';
import LobbyController from './controllers/LobbyController.js';

const port = process.env.PORT || 3000;
const socketServer = new SocketServer({ port });

const server = await socketServer.start();

const roomPubSub = new Event()

const roomsControllers = new RoomsController({ roomPubSub });
const lobbyController = new LobbyController({
  activeRooms: roomsControllers.rooms,
  roomsListener: roomPubSub,
});

const namespaces = {
  room: { controller: roomsControllers, eventEmitter: new Event() },
  lobby: { controller: lobbyController, eventEmitter: roomPubSub}
}

const routeConfig = Object.entries(namespaces)
  .map(([namespaces, { controller, eventEmitter }]) => {
    const controllerEvents = controller.getEvents();
    eventEmitter.on(
      constants.events.USER_CONNECTED, 
      controller.onNewConnection.bind(controller)
    );

    return {
      [namespaces]: {
        events: controllerEvents,
        eventEmitter
      }
    }
  });

socketServer.attachEvents({ routeConfig });

console.log('socket server is running at', server.address().port);