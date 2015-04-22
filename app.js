angular.module('app',[
  'ngRoute',
  'controllers',
  'services',
  'directives',
  'youtube-embed'
])
.constant('AUTH', {
    client_id:'260397451199-vnhh12pguvmtpat7phitbiv2467jla03.apps.googleusercontent.com',
    redirect_uri: "http://dev.axschech.com/youtube",
    response_type: "token",
    scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/userinfo.email',
    key: 'AIzaSyChVTrAM1DUiOYZcz_rjXy5KcrXFAEUp3'
})
.config(function ($routeProvider) {
	$routeProvider
	.when('/home', {
		redirectTo: '/'
	}) 
	.when('/playlists', {
		templateUrl: 'views/playlists.html',
		controller: 'PlaylistsController'
	})
	.when('/videos/:video', {
		templateUrl: 'views/videos.html',
		controller: 'VideosController'
	})
	.when('/video/:video', {
		templateUrl: 'views/video.html',
		controller: 'VideoController'
	})
});


angular.module('controllers',[]);
angular.module('services', []);
angular.module('directives', []);