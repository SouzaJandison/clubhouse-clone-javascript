import Attendee from "../entities/Attendee.js";
import getTemplate from "../templates/attendeeTemplate.js";

const $imgUser = document.querySelector('#imgUser');
const $roomTopic = document.querySelector('#pTopic');
const $gridAttendees = document.querySelector('#gridAttendees');
const $gridSpeakers = document.querySelector('#gridSpeakers');

export default class View {
  static updateUserImage({ img, username }) {
    $imgUser.src = img;
    $imgUser.alt = username;
  }

  static updateRoomTopic({ topic }) {
    $roomTopic.innerHTML = topic;
  }

  static updateAttendeesOnGrid(users) {
    users.forEach(user => this.addAttendeeOnGrid(user));
  }

  static _getExistingItemOnGrid({ id, baseElement = document }) {
    const existingItem = document.querySelector(`[id="${id}"]`);
    return existingItem;
  }

  static removeItemFromGrid(id) {
    const existingElement = this._getExistingItemOnGrid({ id });

    existingElement?.remove();
  }

  static addAttendeeOnGrid(item, removeFirst = false) {
    const attendee = new Attendee(item);

    const htmlTemplate = getTemplate(attendee);

    const baseElement = attendee.isSpeaker ? $gridSpeakers : $gridAttendees;

    if(removeFirst) {
      this.removeItemFromGrid(attendee.id);
      baseElement.innerHTML += htmlTemplate;
      return;
    }

    const existingItem = this._getExistingItemOnGrid({ id: attendee.id, baseElement });

    if(existingItem) {
      existingItem.innerHTML += htmlTemplate;
      return;
    }

    baseElement.innerHTML += htmlTemplate;

  }
}