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
            console.log('kenh');
    		$scope.Auth.auth();
            // $scope.Auth.setService();
	        $scope.Auth.$promise.promise.then(function () {
	        	$scope.buttonText = "Sign out";
                $location.path('playlists');
	        });
    	} else {
            console.log('wenh');
            $scope.buttonText = "Sign In";
            $scope.signOut();
        }
        
    };

    $scope.signOut = function () {
        console.log('henh');
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
    $routeParams,
    $sce,
    VideoService
) {
    $scope.youtube = {
        video: ""
    };

    VideoService.getVideo($routeParams.video).then(function (response) {
        $scope.youtube.video = $sce.trustAsHtml(response.data.items[0].player.embedHtml);
    });
});