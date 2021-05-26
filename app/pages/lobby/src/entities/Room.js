class Attendde {
  constructor({ id, img, username }) {
    this.id = id;
    this.img = img;
    this.username = username;
  }
}

export default class Room {
  constructor({ 
    id, 
    topic, 
    subTopic,
    roomLink,
    attenddesCount, 
    speakersCount, 
    featuredAttenddes, 
    owner, 
  }) {
    this.id = id; 
    this.topic = topic;
    this.subTopic = subTopic || 'Sem Sub Topic';
    this.roomLink = roomLink;
    this.attenddesCount = attenddesCount; 
    this.speakersCount = speakersCount;
    this.featuredAttenddes = featuredAttenddes?.map(attendde => new Attendde(attendde));
    this.owner = new Attendde(owner);
  }
}