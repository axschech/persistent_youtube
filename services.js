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
					part: "snippet",
					mine: "true",
					key: AUTH.key,
					access_token: session.access_token
				}
			});
		}
	}
});