var socket = io() || {};
socket.isReady = false;
var cur_user_id = null;

window.addEventListener('load', function () {

	var execInUnity = function (method) {
		if (!socket.isReady) return;

		var args = Array.prototype.slice.call(arguments, 1);
		if (unityInstance != null) {
			window.unityInstance.SendMessage("NetworkManager", method, args.join(':'));
		}

	};

	socket.on('PONG', function () {

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnPrintPongMsg');
		}

	});
	socket.on('CAN_START_GAME', function () {
		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnCanStartGame');
		}

	});
	socket.on('SPAWN_PLAYER', function (id, name, avatar, dx) {
		var currentUserAtr = id + ':' + name + ':' + avatar + ':' + dx;
		console.log("SPAWN_PLAYER:: ",currentUserAtr)
		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnSpawnPlayer', currentUserAtr);
		}
	});

	socket.on('UPDATE_POS_AND_ROT', function (id, dx, dy, rotation) {
		var currentUserAtr = id + ':' + dx + ':' + dy + ':' + rotation;

		if (unityInstance != null) {
			unityInstance.SendMessage('NetworkManager', 'OnUpdatePosAndRot', currentUserAtr);
		}
	});

	socket.on('CREATE_ROOM_SUCCESS', function (id, current_players, max_players, map) {
		var currentUserAtr = id + ':' + current_players + ':' + max_players + ':' + map;

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnCreateRoom', currentUserAtr);
		}
		cur_user_id = id;
	});

	socket.on('LEAVE_ROOM_SUCCESS', function (roomid) {
		console.log('LEAVE_ROOM_SUCCESS', roomid);
		var currentUserAtr = roomid;
		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnPlayerLeaveRoom', currentUserAtr);
		}
	})

	socket.on('OPEN_LOBBY_ROOM', function (id, current_players, max_players, map) {
		var currentUserAtr = id + ':' + current_players + ':' + max_players + ':' + map;

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnOpenLobbyRoom', currentUserAtr);
		}
	});

	socket.on('UPDATE_CURRENT_PLAYERS', function (current_players) {
		var currentUserAtr = current_players + ':';

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnUpdateCurrentPlayers', currentUserAtr);
		}
	});

	socket.on('START_GAME', function (id, name, avatar) {
		var currentUserAtr = id + ':' + name + ':' + avatar;

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnStartGame', currentUserAtr);
		}
	});

	socket.on('UPDATE_PLAYER_DAMAGE', function (id, health) {
		var currentUserAtr = id + ':' + health;

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnUpdatePlayerDamage', currentUserAtr);
		}
	});

	socket.on('UPDATE_ROOMS', function (id,
		name,
		current_players,
		max_players) {

		var currentUserAtr = id + ':' + name + ':' + current_players + ':' + max_players;
		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnReceiveRooms', currentUserAtr);
		}
	});

	socket.on('GAME_OVER', function (id) {
		var currentUserAtr = id;

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnGameOver', currentUserAtr);
		}
	});

	socket.on('UPDATE_ANIMATOR', function (id, animation) {
		var currentUserAtr = id + ':' + animation;

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnUpdateAnim', currentUserAtr);
		}
	});

	socket.on('USER_DISCONNECTED', function (id) {
		var currentUserAtr = id;

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnUserDisconnected', currentUserAtr);
		}
	});

	socket.on('USER_AUDIO_MUTE', function (id, isMute) {
		var currentUserAtr = id + ':' + isMute;

		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnUserAudioMuteUpdate', currentUserAtr);
		}
	});

	socket.on('PLAYER_VOICE_START', function (data) {
		// console.log("Client PLAYER_VOICE_START ------ ", data);
		// call to unity
		// if (unityInstance != null) {
		// 	window.unityInstance.SendMessage('NetworkManager', 'OnPlayerVoiceStart', data);
		// }
	})
});//END_WINDOW.ADDEVENTLISTENER



window.onload = (e) => {
	mainFunction(1000);
};

function mainFunction(time) {
	navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
		var madiaRecorder = new MediaRecorder(stream);
		madiaRecorder.start();

		var audioChunks = [];

		madiaRecorder.addEventListener("dataavailable", function (event) {
			audioChunks.push(event.data);
		});

		madiaRecorder.addEventListener("stop", function () {
			var audioBlob = new Blob(audioChunks);
			audioChunks = [];
			var fileReader = new FileReader();

			fileReader.readAsDataURL(audioBlob);
			fileReader.onloadend = function () {
				var base64String = fileReader.result;
				socket.emit("VOICE", base64String,);
			};
			madiaRecorder.start();
			setTimeout(function () {
				madiaRecorder.stop();
			}, time);
		});

		// socket.on("START_SPEAK", function (data) {
		// madiaRecorder.addEventListener("start", function () {
		// 	socket.emit("VOICE_START", cur_user_id);
		// 	console.log("VOICE_START Event.....", madiaRecorder.state);
		// });
		// });


		setTimeout(function () {
			madiaRecorder.stop();
		}, time);
	});

	socket.on("UPDATE_VOICE", function (data) {
		var audio = new Audio(data);
		audio.play();

	});

	socket.on("SPEACK_VOICE", function (userId) {
		console.log("userId :: ", userId)
		if (unityInstance != null) {
			window.unityInstance.SendMessage('NetworkManager', 'OnPlayerVoiceStart', userId);
		}
	});

}
