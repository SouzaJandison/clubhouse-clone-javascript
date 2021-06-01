import { constants } from "../../../shared/constants.js";
import Attendee from "../entities/Attendee.js";
import getTemplate from "../templates/attendeeTemplate.js";

const $imgUser = document.querySelector('#imgUser');
const $roomTopic = document.querySelector('#pTopic');
const $gridAttendees = document.querySelector('#gridAttendees');
const $gridSpeakers = document.querySelector('#gridSpeakers');

const $btnMicrophone = document.querySelector('#btnMicrophone');
const $btnClipBoard = document.querySelector('#btnClipBoard');
const $btnClap = document.querySelector('#btnClap');
const $toggleImage = document.querySelector('#toggleImage');
const $btnLeave = document.querySelector('#btnLeave');

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

  static showUserFeatures(isSpeaker) {
    if(!isSpeaker) {
      $btnClap.classList.remove('hidden');
      $btnMicrophone.classList.add('hidden');
      $btnClipBoard.classList.add('hidden');
      return;
    }

    $btnClap.classList.add('hidden');
    $btnMicrophone.classList.remove('hidden');
    $btnClipBoard.classList.remove('hidden');
  }

  static _createAudioElement({ muted = true, srcObject }) {
    const audio = document.createElement('audio');
    audio.muted = muted;
    audio.srcObject = srcObject;

    audio.addEventListener('loadedmetadata', async () => {
      try {
        await audio.play();
      } catch (error) {
        console.log('erro to play', error);
      }
    });
  }

  static renderAudioElement({ stream, isCurrentId }) {
    this._createAudioElement({
      muted: isCurrentId,
      srcObject: stream,
    });
  }

  static _onClapClick(command) {
    return () => {
      command();

      const basePath = './../../assets/icons/';
      const handActive = 'hand-solid.svg';
      const handInactive = 'hand.svg';

      if($toggleImage.src.match(handInactive)) {
        $toggleImage.src = `${basePath}${handActive}`;
        return;
      }

      $toggleImage.src = `${basePath}${handInactive}`;
    }
  }

  static configureClapButton(command) {
    $btnClap.addEventListener('click', this._onClapClick(command));
  }

  static _redirectToLobby() {
    window.location = constants.pages.lobby;
  }

  static configureLeaveButton() {
    $btnLeave.addEventListener('click', () => {
      this._redirectToLobby();
    });
  }

  static _toggleMicrophoneIcon() {
    const icon = $btnMicrophone.firstElementChild;
    const classes = [...icon.classList];

    const inactiveMicClass = 'fa-microphone-slash';
    const activeMicClass = 'fa-microphone';

    const isInactiveMic = classes.includes(inactiveMicClass);
    
    if(isInactiveMic) {
      icon.classList.remove(inactiveMicClass);
      icon.classList.add(activeMicClass);
      return;
    }

    icon.classList.remove(activeMicClass);
    icon.classList.add(inactiveMicClass);
  }

  static cofigureOnMicrophoneActivation(command) {
    $btnMicrophone.addEventListener('click', () => {
      this._toggleMicrophoneIcon();
      command();
    })
  }
}