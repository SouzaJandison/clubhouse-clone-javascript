import Attendde from "./Attendee.js";

export default class Room {
  constructor({ 
    id, 
    topic, 
    attenddesCount, 
    speakersCount, 
    featuredAttenddes, 
    owner, 
    users, 
  }) {
    this.id = id; 
    this.topic = topic;
    this.attenddesCount = attenddesCount; 
    this.speakersCount = speakersCount;
    this.featuredAttenddes = featuredAttenddes?.map(attendde => new Attendde(attendde));
    this.owner = new Attendde(owner);
    this.users = users;
  }
}