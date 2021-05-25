import SocketServer from './utils/Socket.js';
import RoomsController from './controllers/RoomsController.js';
import Event from 'events';
import { constants } from './utils/constants.js';

const port = process.env.PORT || 3000;
const socketServer = new SocketServer({ port });

const server = await socketServer.start();

const roomsControllers = new RoomsController();

const namespaces = {
  room: { 
    controller: roomsControllers, 
    eventEmitter: new Event(),
  }
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