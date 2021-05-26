import Room from './entities/Room.js';
import getTemplate from './templates/lobbyItem.js';

const $roomGrid = document.querySelector('#roomGrid');
const $imgUser = document.querySelector('#imgUser');

const $btnCreateRoomWithTopic = document.querySelector('#btnCreateRoomWithTopic');
const $btnCreateRoomWithoutTopic = document.querySelector('#btnCreateRoomWithoutTopic');
const $txtTopic = document.querySelector('#txtTopic');

export default class View {
  static clearRoomList() {
    $roomGrid.innerHTML = '';
  }

  static generateRoomLink({ id , topic }) {
    return `../room/index.html?id=${id}&topic=${topic}`
  }

  static redirectToRoom(topic = '') {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);

    window.location = this.generateRoomLink({ id, topic });
  }

  static configureCreateRoomButoon() {
    $btnCreateRoomWithoutTopic.addEventListener('click', () => {
      this.redirectToRoom();
    });

    $btnCreateRoomWithTopic.addEventListener('click', () => {
      const topic = $txtTopic.value;
      this.redirectToRoom(topic);
    });
  }

  static updateRoomList(rooms) {
    this.clearRoomList();
    console.log('rooms', rooms);

    rooms.forEach(room => {
      const params = new Room({
        ...room,
        roomLink: this.generateRoomLink(room),
      });

      console.log(params);

      const htmlTemplate = getTemplate(params);

      $roomGrid.innerHTML += htmlTemplate;
    });
  }

  static updateUserImage({ img, username }) {
    $imgUser.src = img;
    $imgUser.alt = username;
  }
}