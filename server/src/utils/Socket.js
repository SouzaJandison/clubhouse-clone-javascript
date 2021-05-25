import http from 'http';
import { Server } from 'socket.io';
import { constants } from './constants.js';

export default class SocketServer {
  #io

  constructor({ port }) {
    this.port = port;
    this.namespace = {};
  }

  attachEvents({ routeConfig }) {
    for (const routes of routeConfig) {
      for (
        const [namespace, { events, eventEmitter }] of Object.entries(routes)
      ) {
        const route = this.namespace[namespace] = this.#io.of(`/${namespace}`);
        route.on('connection', socket => {
          for (const [functionName, functionValue] of events) {
            socket.on(functionName, (...args) => functionValue(socket, ...args));
          }

          eventEmitter.emit(constants.events.USER_CONNECTED, socket);
        });
      }
    }
  }

  async start() {
    const server = http.createServer((request, response) => {
      response.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      });

      return response.end('Hey there!');
    });

    this.#io = new Server(server, {
      cors: {
        origin: '*',
        credentials: false,
      }
    });

    return new Promise((resolve, reject) => {
      server.on('Error', reject);

      server.listen(this.port, () => resolve(server));
    });
  }
}