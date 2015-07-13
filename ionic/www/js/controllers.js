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

.controller('home', ['$scope', '$rootScope', 'Idea', '$http', '$stateParams', '$ionicModal', function($scope, $rootScope, Idea, $http, $stateParams, $ionicModal ) {

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
      input.Ideas[id].likes_count+=1;
      $scope.toggleLikes= !$scope.toggleLikes;
    }
      
  };

    $scope.unlike = function(id, input){
    if($scope.toggleLikes){
    input.Ideas[id].likes_count-=1;
    $scope.toggleLikes =!$scope.toggleLikes;
    }
  };

  $scope.toggleLikes = false;

  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  }

  $scope.tagProcessor = function(text){
    var returnTag ="";

    if (text){
      var tagArray = text.split(", ");
      for (i = 0; i < tagArray.length; i++){
        returnTag = returnTag.concat("#" + tagArray[i] + " ");
      }
      return returnTag.substring(0, returnTag.length-1);
    }

  }

  $scope.data = Idea.get();


  $scope.doRefresh = function(){

    $scope.data = null;
    $scope.data = Idea.get(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
    
   };

   $scope.findArray = function(id){
    for (i=0; i< $scope.data.Ideas.length; i++){
      if ($scope.data.Ideas[i].id ==id){
        console.log(i);
        $rootScope.currentIndex = i;
      }
    }
    

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

   $scope.forgotPw = function(user) {
    <!--console.log('Forgot-pw', user);-->
    $state.go('forgotpw');
  };

  $scope.register = function(user) {
    <!--console.log('Register', user);-->
    $state.go('register');
  };
  
})


.controller('searchCon', ['$scope','Idea', function($scope, Idea){



    $scope.search = function(){
      var jsonF = ["Hi","Hi"];
      Idea.save(jsonF, function(content1){
        console.log(content1);
        $scope.searchResult = content1['Result'];
      });

    }

$("#autocomplete").autocomplete({
source: ["c++","c++","java","php","coldfusion","javascript","asp","ruby"]
});

}]);