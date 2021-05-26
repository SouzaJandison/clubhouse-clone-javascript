import Room from "../entities/Room.js";

function createFeaturedSpeakersTemplate(featuredAttenddes) {
  if(!featuredAttenddes.length) return '';
  
  const attendees = featuredAttenddes.map(attendee => {
    return `<li>${attendee.username} <span role="img" class="emoji">💬</span></li>`
  });
  
  return attendees.join('');
}

export default function getTemplate(room = new Room()) {
  const { owner } = room;
  return `
    <a id="${room.id}" href="${room.roomLink || "#"}">
      <div class="cards__card">
        <span class="cards__card__topicRoom">
          ${room.subTopic}
          <i class="fa fa-home"></i>
        </span>
        <p class="cards__card__title">
        <p class="cards__card__title">
          ${room.topic}
        </p>
        <div class="cards__card__info">
          <div class="avatar">
            <img src="${owner.img}" alt="${owner.username}">
          </div>
          <div class="cards__card__info__speakers">
            <ul>
              ${createFeaturedSpeakersTemplate(room.featuredAttenddes)}
              <span class="cards__card__info__speakers__listeners">
                ${room.attenddesCount} <i class="fa fa-user"></i> / ${room.speakersCount}
                <i class="fa fa-comment"></i>
              </span>
            </ul>
          </div>
        </div>
      </div>
    </a>
  `
}
