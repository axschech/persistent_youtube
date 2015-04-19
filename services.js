angular.module('services', [])
.factory('AuthService', function (AUTH, $q, SessionService) {
	function service() {
		this.$promise = $q.defer();
		this.setService();
	}

	service.prototype.auth = function () {
		var self = this;
		gapi.auth.authorize(
			{
				client_id: AUTH.client_id,
				scope: AUTH.scope,
				prompt: "select_account consent"
			}, 
			function (response) {
				setTimeout(function () {
					SessionService.set(response);
					self.setService();
					self.$promise.resolve();
				}, 1000);
				
			});
	};

	service.prototype.logout = function () {
		SessionService.clear();
		this.setService();
	};

	service.prototype.setService = function () {
		this.session = SessionService.get();
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
		getVideos: function (playlistId) {
			var session = SessionService.get();
			var self = this;

			return $http({
				url: self.pUrl,
				method: 'GET',
				params: {
					part: "snippet",
					key: AUTH.key,
					playlistId: playlistId,
					access_token: session.access_token,
					maxResults: 9
				}
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