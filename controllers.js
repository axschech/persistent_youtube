angular.module('controllers',[])
.controller('SignIn', 
function(
	$scope,
    $location,
	AuthService
) {
    
    $scope.Auth = new AuthService();
    if($scope.Auth.session === false) {
    	$scope.buttonText = "Sign In";
    } else {
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
        // $scope.Auth.setService();
        console.log($scope.Auth.session);
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
    $scope.youtube = {
        playlists: []
    }

    $scope.getPlaylists = function () {
        YoutubeService.getPlaylists().then(function (response) {
            console.log(response.data.items);
            $scope.youtube.playlists = response.data.items;
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
        videos: []
    };

    VideosService.getVideos($routeParams.video).then(function (response) {
        $scope.youtube.videos = response.data.items;
    });

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