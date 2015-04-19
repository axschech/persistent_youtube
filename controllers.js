angular.module('controllers',[])
.controller('SignIn', 
function(
	$scope,
    $location,
    $route,
	AuthService
) {
    $scope.restart = function () {
        location.reload();
    };
    $scope.Auth = new AuthService();
    if($scope.Auth.session === false) {
    	$scope.buttonText = "Sign In";
    } else {
        $scope.Auth.checkSession();
    	$location.path('playlists');
    	$scope.buttonText = "Sign out";
    }
    $scope.auth = function () {
    	if($scope.Auth.session === false) {
    		$scope.Auth.auth();
            // $scope.Auth.setService();
	        $scope.Auth.$promise.promise.then(function () {
	        	$scope.buttonText = "Sign out";
                $location.path('playlists');
	        });
    	} else {
            $scope.buttonText = "Sign In";
            $scope.signOut();
        }
        
    };

    $scope.signOut = function () {
        $scope.Auth.logout();
        $location.path("/");
    };
})
.controller('PlaylistsController',
function (
    $scope,
    $location,
    YoutubeService
) {
    $scope.page = "playlists";
    $scope.change = function (page) {
        $scope.page = page;
    };

    $scope.youtube = {
        playlists: []
    }

    $scope.getPlaylists = function () {
        var promise = YoutubeService.getPlaylists();
        promise.then(function (response) {
            console.log(response.data.items);
            $scope.youtube.playlists = response.data.items;
        });
        promise.error(function () {
            $location.path('/');
        });
    }

    $scope.getPlaylists();

    $scope.goToPlaylist = function (id) {
        $location.path('videos/' + id);
    };
})
.controller('VideosController',
function (
    $scope,
    $routeParams,
    $location,
    VideosService
) {

    $scope.youtube = {
        videos: [],
        next: false,
        previous: false
    };

    $scope.getVideos = function () {
        VideosService.getVideos(
            $routeParams.video,
            $scope.youtube.next,
            $scope.youtube.previous
        ).then(function (response) {
            $scope.youtube.videos = response.data.items;
            if(angular.isDefined(response.data.nextPageToken)) {
                $scope.youtube.next = response.data.nextPageToken;
            } else {
                $scope.youtube.next = false;
            }

            if(angular.isDefined(response.data.prevPageToken)) {
                $scope.youtube.previous = response.data.prevPageToken;
            } else {
                $scope.youtube.previous = false;
            }
            
        });
    };
    
    $scope.getVideos();

    $scope.goToVideo = function (videoId) {
        $location.path('video/' + videoId);
    };
})
.controller('VideoController',
function (
    $scope,
    $routeParams
) {
    $scope.youtube = {
        video: $routeParams.video,
        config: {
            controls: 1,
            autoplay: 0
        }
    };

    $scope.$on('youtube.player.paused', function ($event, player) {
    // play it again
        var time = Math.floor(player.getCurrentTime());
    });

});