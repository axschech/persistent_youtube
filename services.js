angular.module('services', [])
.factory('AuthService', function (AUTH, $q, $http, SessionService) {
	function service() {
		this.$promise = $q.defer();
		this.setService();
	}

	service.prototype.auth = function () {
		var self = this;
		setTimeout(function () {
		gapi.auth.authorize(
			{
				client_id: AUTH.client_id,
				scope: AUTH.scope,
				prompt: "select_account consent"
			}, 
			function (response) {
				setTimeout(function () {
					var info = self.getInfo(response.access_token);
					info.then(function (infoResponse) {
						response.info = infoResponse.data;
						SessionService.set(response);
						self.setService();
						self.$promise.resolve();
					})
					
				}, 1000);
				
			});
		}, 1000);
	};

	service.prototype.logout = function () {
		SessionService.clear();
		this.setService();
	};

	service.prototype.setService = function () {
		this.session = SessionService.get();
	};

	service.prototype.checkSession = function () {
		if(angular.isDefined(this.session.expires_at)) {
			if(moment().unix() > this.session.expires_at) {
				this.auth();
			}
		}
	};

	service.prototype.getInfo = function (access_token) {
		var url = "https://www.googleapis.com/oauth2/v3/userinfo";
		return $http({
			url: url,
			params: {
				access_token: access_token
			}
		});
	};

	return service;
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
.service('VideosService', function ($http, AUTH, SessionService) {
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

			return $http({
				url: self.pUrl,
				method: 'GET',
				params: params
			});
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