angular.module('controllers',[])
.controller('SignIn', 
function(
	$scope,
    $location,
    $route,
	AuthService,
    ServerService
) {
    $scope.restart = function () {
        $location.path('/playlists');
    };
    console.log('running');
    $scope.Auth = AuthService;
    $scope.Auth.setService();
    if($scope.Auth.session === false) {
        console.log("am am");
    	$scope.buttonText = "Sign In";
    } else {
        if(!$scope.Auth.checkSession()) {
            console.log('am here');
            console.log($scope);
        }
        AuthService.getSavedInfo(AuthService.session.info.email).then(function () {
            if(AuthService.session.info.server.data.videoId) {
                ServerService.playlist.id = AuthService.session.info.server.data.playlistId;
                ServerService.playlist.index = AuthService.session.info.server.data.playlistIndex;
                $location.path('video/' + AuthService.session.info.server.data.videoId);
            } else {
                $location.path('playlists');
            }
        });
        
    	
    	$scope.buttonText = "Sign out";
    }
    $scope.auth = function () {
    	if($scope.Auth.session === false) {
    		$scope.Auth.auth();
            // $scope.Auth.setService();
	        $scope.Auth.$promise.promise.then(function () {
	        	$scope.buttonText = "Sign out";
                if(AuthService.session.info.server.data.videoId) {
                    ServerService.playlist.id = AuthService.session.info.server.data.playlistId;
                    ServerService.playlist.index = AuthService.session.info.server.data.playlistIndex;
                    $location.path('video/' + AuthService.session.info.server.data.videoId);
                } else {
                    $location.path('playlists');
                }
	        });
    	} else {
            $scope.buttonText = "Sign In";
            $scope.signOut();
        }
        
    };

    $scope.signOut = function () {
        $scope.Auth.logout();
        $location.path('/');
        location.reload();
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
            console.log('there');
            $location.path('/');
        });
    };

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
    ServerService,
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

    $scope.goToVideo = function (videoId, playlistIndex) {
        ServerService.playlist.index = playlistIndex;
        $location.path('video/' + videoId);
    };
})
.controller('VideoController',
function (
    $scope,
    $routeParams,
    ServerService,
    SessionService
) {
    $scope.session = SessionService.get();
    $scope.youtube = {
        video: $routeParams.video,
        config: {
            controls: 1,
            autoplay: 0
        },
        player: undefined
    };
    $scope.videoId = $routeParams.video;
    $scope.$on('youtube.player.ready', function() {
        if($scope.session.info.server.data.videoId !== $scope.videoId) {
            $scope.session.info.server.data.time = 0;
        }
        if(ServerService.playlist.id) {
            $scope.youtube.player.loadPlaylist({
                listType: 'playlist',
                list: ServerService.playlist.id,
                index: ServerService.playlist.index,
                startSeconds: $scope.session.info.server.data.time
            })
        }

        if($scope.session.info.server.data.time) {
            $scope.youtube.player.seekTo($scope.session.info.server.data.time);
        }
    });
    $scope.$on('youtube.player.queued', function () {
        console.log('hey!');
    });
    $scope.$on('youtube.player.paused', function ($event, player) {
        var time = Math.floor(player.getCurrentTime()),
            videoId = $routeParams.video;
        console.log(time);
        ServerService.setSavedInfo(time, videoId);
    });

    $scope.$on('$destroy', function (event) {
        if($scope.youtube.player.getPlayerState() === 1) {
            var time = Math.floor($scope.youtube.player.getCurrentTime()),
            videoId = $scope.videoId;

            ServerService.setSavedInfo(time, videoId);
        }
        
    });
});