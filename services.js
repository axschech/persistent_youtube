angular.module('services', [])
.service('AuthService', 
	function (
		AUTH,
		$q,
		$http,
		$timeout,
		SessionService,
		ServerService
	) {
	return {
		session: false,
		$promise: $q.defer(),
		auth: function () {
			var self = this;
			gapi.auth.authorize(
				{
					client_id: AUTH.client_id,
					scope: AUTH.scope,
					prompt: "select_account consent"
				}, 
				function (response) {
						var info = self.getInfo(response.access_token);
						info.then(function (infoResponse) {
							response.info = infoResponse.data;
							console.log(response.info.email);
							self.getSavedInfo(response.info.email).then(function (serverResponse, errorResponse) {
								if(angular.isDefined(serverResponse)) {
									response.info.server = serverResponse.data[0];
								} else {
									response.info.server = false;
								}
								SessionService.set(response);
								self.setService();
								self.$promise.resolve();
							});
							
						});
					
				});
		},
		logout: function () {
			SessionService.clear();
			this.session = false;
		},
		setService: function () {
			this.session = SessionService.get();
		},
		checkSession: function () {
			if(angular.isDefined(this.session.expires_at)) {
				if(moment().unix() > this.session.expires_at) {
					return false;
				}
			}
			return true;
		},
		getInfo: function (access_token) {
			var url = "https://www.googleapis.com/oauth2/v3/userinfo";
			return $http({
				url: url,
				params: {
					access_token: access_token
				}
			});
		},
		getSavedInfo: ServerService.getSavedInfo

	};
})
.service('SessionService', function () {
	return {
		set: function (value) {
			localStorage.setItem('session', JSON.stringify(value));
		},
		get: function() {
			var session = localStorage.getItem('session');
			return (session) ? JSON.parse(session) : false;
		},
		clear: function() {
			localStorage.clear();
		}
	}
})
.service('ServerService', function ($http, SessionService) {
	return {
		playlist: {},
		getSavedInfo: function (email) {
			return $http({
				url: 'http://dev.axschech.com/node',
				params: {
					code: email
				}
			});
		},
		setSavedInfo: function (time, videoId) {
			var session = SessionService.get();
			var email = session.info.email,
				url = "http://dev.axschech.com/node",
				playlistId = this.playlist.id,
				playlistIndex = this.playlist.index,
				data = {
					videoId: videoId,
					playlistId: playlistId,
					playlistIndex: playlistIndex,
					time: time
				};
			
			session.info.server.data = data;
			SessionService.set(session);
			return $http({
				url: url,
				method: "POST",
				data: {
					email: email,
					data: data
				}
			})
		}
	};
})
.service('YoutubeService', function ($http, AUTH, SessionService) {
	return {
		url: "https://www.googleapis.com/youtube/v3/playlists",
		getPlaylists: function () {
			var session = SessionService.get();

			return $http({
				url: this.url,
				params: {
					part: "snippet,id",
					mine: "true",
					key: AUTH.key,
					access_token: session.access_token
				}
			});
		}
	}
})
.service('VideosService', function ($http, AUTH, SessionService, ServerService) {
	return {
		pUrl: "https://www.googleapis.com/youtube/v3/playlistItems",
		getVideos: function (playlistId, next, previous) {

			var session = SessionService.get();
			var self = this;
			var params = {
				part: "snippet",
				key: AUTH.key,
				playlistId: playlistId,
				access_token: session.access_token,
				maxResults: 9
			};
			console.log(previous);
			if (next) {
				params.pageToken = next;
			}

			if (previous) {
				params.pageToken = previous;
			}

			var promise = $http({
				url: self.pUrl,
				method: 'GET',
				params: params
			});

			promise.then(function () {
				ServerService.playlist.id = playlistId;
			});

			return promise;
		}
	}
})
.service('VideoService', function ($http, AUTH, SessionService) {
	return {
		video: "",
		vUrl: "https://www.googleapis.com/youtube/v3/videos",
		getVideo: function (videoId) {
			var session = SessionService.get();
			var self = this;

			return $http({
				url: self.vUrl,
				method: 'GET',
				params: {
					id: videoId,
					part: "player",
					key: AUTH.key,
					playlistId: videoId,
					access_token: session.access_token
				}
			});
		}
	}
});