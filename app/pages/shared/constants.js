export const constants = {
	socketUrl: 'http://localhost:3000',
	socketNamespaces: {
		room: 'room',
		lobby: 'lobby',
	},
  pages: {
    lobby: '/pages/lobby',
    login: '/pages/login',
  },
  events: {
		USER_CONNECTED: 'userConnection',
		USER_DISCONNECT: 'userDisconnection',
    JOIN_ROOM: 'joinRoom',
    LOBBY_UPDATED: 'lobbyUpdated',
    UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
    SPEAK_REQUEST: 'speakRequest',
    SPEAK_ANSWER: 'speakAnswer',
	},
  peerConfig: Object.values({
    id: undefined,
    // config: {

    // }
  }),
}