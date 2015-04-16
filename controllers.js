angular.module('controllers',[])
.controller('SignIn', 
function(
	$scope, 
	AuthService,
	YoutubeService
) {
    $scope.youtube = {
    	playlists: []
    }
    $scope.Auth = new AuthService();
    $scope.status = false;
    if($scope.Auth.session === false) {
    	$scope.buttonText = "Sign In";
    } else {
    	YoutubeService.getPlaylists().then(function (response) {
    		console.log(response.data.items);
    		$scope.youtube.playlists = response.data.items;
    	});
    	$scope.status = true;
    	$scope.buttonText = "Sign out";
    }
    $scope.auth = function () {
    	if(!$scope.status) {
    		$scope.Auth.auth();
	        $scope.Auth.$promise.promise.then(function () {
	        	$scope.status = true;
	        	$scope.buttonText = "Sign out";
	        });
    	}
        
    };
});