angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
  };
})

.controller('PlaylistsCtrl', ['$scope', '$state', function($scope, $state) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
  $scope.whichplaylist = $state.params.playlistId;
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('home', ['$scope', '$rootScope', '$http', '$stateParams', '$ionicModal', function($scope, $rootScope, $http, $stateParams, $ionicModal) {

  // $scope.doRefresh = function(){

  //     $http.get('js/data.json').success(function(data){
  //     $scope.data = data;
  //     $scope.$broadcast('scroll.refreshComplete');
  //    })
  //   };

  // $http.get("js/data.json").success(function(data){
  //     $scope.data = data;
  //     for (i=0; i< $scope.data.Ideas.length ; i++){
  //       $scope.data.Ideas[i].id = i;
  //     }
  // })


  $scope.currentPage = $stateParams.id;

  $scope.like = function(id, input){
    if (!$scope.toggleLikes){
      input.Ideas[id].Likes+=1;
      $scope.toggleLikes= !$scope.toggleLikes;
    }
      
  };

    $scope.unlike = function(id, input){
    if($scope.toggleLikes){
    input.Ideas[id].Likes-=1;
    $scope.toggleLikes =!$scope.toggleLikes;
  }
  };

  $scope.toggleLikes = false;

  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  }

  

  $scope.changePage = function(id){
    $scope.currentPage = id;
  }

$ionicModal.fromTemplateUrl('templates/comment.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });



}])

.controller('SignInCtrl', function($scope, $state) {
  
  $scope.signIn = function(user) {
    <!--console.log('Sign-In', user);-->
    $state.go('app.home');
  };
  
})


.controller('ideaRest', function($scope, $stateParams, Idea){


  $scope.data=null;

  $scope.data = Idea.get(function(){

      for (i=0; i< $scope.data.Ideas.length ; i++){
        $scope.data.Ideas[i].id = i;
      }
  });



  $scope.doRefresh = function(){

    $scope.data = null;
    $scope.data = Idea.get(function(){

      for (i=0; i< $scope.data.Ideas.length ; i++){
        $scope.data.Ideas[i].id = i;
      }
  });
    $scope.$broadcast('scroll.refreshComplete');
   };

});