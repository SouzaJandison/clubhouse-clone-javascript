export default class LobbyController {
  constructor({ socketBuilder, user, view }) {
   this.socketBuilder = socketBuilder;
   this.user = user;
   this.view = view;
  }

  static async initialize(deps) {
    return new LobbyController(deps)._initialize();
  }

  async _initialize() {
    this._setupViewEvents();

    this.socket = this._setupSocket();
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.user);
    this.view.configureCreateRoomButoon();
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnLobbyUpdate(this.onLobbyUpdate())
      .build();
  }

  onLobbyUpdate() {
    return rooms => {
      console.log('rooms', rooms);
      this.view.updateRoomList(rooms);
    };
  }
}