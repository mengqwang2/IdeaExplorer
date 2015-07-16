angular.module('starter.controllers', [])

.controller('AppCtrl', ['AuthService' ,function($scope, $rootScope, $ionicModal, $timeout, AuthService) {
  
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



}])

.controller('home', ['$scope', '$rootScope', '$state','$ionicPopup', 'AuthService' , 'AUTH_EVENTS','Idea', '$http', '$stateParams', '$ionicModal', function($scope, $rootScope, $state, $ionicPopup, AuthService, AUTH_EVENTS, Idea, $http, $stateParams, $ionicModal ) {

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

  $rootScope.username = AuthService.username();
 
  // $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Unauthorized!',
  //     template: 'You are not allowed to access this resource.'
  //   });
  // });
 <!--login-->
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('signin');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
  $scope.setCurrentUsername = function(name) {
    $rootScope.username = name;
  };

 <!--login-->


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


$scope.sections = [['Background', 'relevance_to_challenge'], ['Details','description'], ['Practical Problems Solved', 'practical_problem_solved'],['Success Benefits','success_benefit']];

 $scope.show_section = { "relevance_to_challenge": false, "description": false , "practical_problem_solved": false, "success_benefit" : false};
    $scope.section_select = function(section, $event) {
      $scope.show_section[section] = !$scope.show_section[section];
      $scope.$broadcast('scroll.resize');
  };



  

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

.controller('SignInCtrl', function($scope, $rootScope, $state, $ionicPopup, AuthService) {
  
  $scope.signIn = function(user) {
    if ((user == null)|| (user.username==null)||(user.password == null)){
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
      return;
    }
    //debug
    if (user.username ==='admin'){
      $state.go('app.home', {}, {reload: true});
      return; //temporary
    }
    //
    AuthService.login(user.username, user.password).then(function(authenticated) {
      user.username = "";
      user.password = "";
      $state.go('app.home', {}, {reload: true});

      $scope.setCurrentUsername(user.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
    
  };

   $scope.forgotPw = function(user) {
    <!--console.log('Forgot-pw', user);-->
    $state.go('forgotpw');
  };

  $scope.register = function(user) {
    <!--console.log('Register', user);-->
    $state.go('register');
  };
  

  $scope.setCurrentUsername = function(name) {
    $rootScope.username = name;
  };


})

.controller('forgetController', function($scope, $ionicPopup, forgetService){


  $scope.mailValidation = function(text){
    console.log("Mail is " + text);
    if (text ==null){
      var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Please input your email!'
      });
      return;
    }
    forgetService.save(text, function(response){
      if (response[success]){
        var alertPopup = $ionicPopup.alert({
        title: 'Email is accepted!',
        template: 'A new password has been sent to you.'
      });
      }
      else
        var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Unsuccessful'
      });
    });
    


  }



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
    })

    $('input').keyup(function(){
      this.value = this.value.toLowerCase();
    });


}]);