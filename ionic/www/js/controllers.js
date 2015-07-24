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

.controller('home', function($scope, $rootScope, $state, $ionicPopup, AuthService, AUTH_EVENTS, Idea, $ionicModal, $q, HabitService, $ionicLoading) {

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



  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  }

  $scope.recordsPerRequest = 5;
  $scope.startRecord = 0; //start from 0
  $scope.terminate = false;

  $rootScope.data = Idea.get({id:$rootScope.username, sind: $scope.startRecord, capacity: $scope.recordsPerRequest},function(content, code){
    console.log(content);
    $ionicLoading.hide();
    // $scope.startRecord = content[]


  });



<!--infinite scroll, load more-->


  $scope.loadMore = function() {





    $scope.$boardcast('scroll.infiniteScrollComplete');
  }


  $scope.doRefresh = function(){

    $rootScope.data = null;
    $rootScope.data = Idea.get(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
    
   };

   $scope.findArray = function(id){
    // for (i=0; i< $scope.data.Ideas.length; i++){
    //   if ($scope.data.Ideas[i].id ==id){
    //     console.log(i);
        // $rootScope.currentIndex = i;
        $rootScope.currentID = id;
      // }
    // }
    

  }

  $scope.track = function(id, username){
    console.log(id);
    console.log(username);
    <!--pass to API-->
    var data = {"Email": username, "Postid": id};
    HabitService.save(data, function(content, value){
      console.log("Habit recorded");
    });
  }



  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });




//rating
// var getAllRating = function(){



//   var promise = [];
//   $rootScope.ratings = [];
//   angular.forEach($scope.data.Ideas, function(idea){
//     var pm = RatingGetService.get({postid: idea.id, email: '0'});
//     promise.push(pm.$promise);
//   });

//   $q.all(promise).then(function(values){
//     angular.forEach(values, function(value){
//       $rootScope.ratings.push(value.rating);

//     });

//   });


// };

// $scope.interpolation = function(value){
//   return $interpolate(value)($scope);
// };

})

.controller('DetailController', function($scope, $rootScope, DetailIdea, AuthService, AUTH_EVENTS, $ionicPopup, $state, $ionicModal, CommentService, $ionicLoading){

  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });

  $scope.datum = DetailIdea.get({id: $rootScope.currentID}, function(returndata){
      console.log(returndata);
      $rootScope.datum = returndata;
      $ionicLoading.hide();
  });

  $scope.sections = [['Background', 'rtc'], ['Details','description'], ['Practical Problems Solved', 'pps'],['Success Benefits','success_benefit']];

  $scope.show_section = { "rtc": false, "description": false , "pps": false, "success_benefit" : false};
    $scope.section_select = function(section, $event) {
      $scope.show_section[section] = !$scope.show_section[section];
      $scope.$broadcast('scroll.resize');
  };
  $scope.similartopic = function() {
    $state.go('app.similartopic', {}, {reload: true});
    //<!--console.log('Similartopic');-->
    //$state.go('similartopic');
  };

   <!--login authentication-->
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('signin');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

<!--comments related-->
$scope.loadComments = function(Postid){
    commentRetrieve(Postid);
    $scope.openModal();
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

    //load comments into CommentController
  var commentRetrieve = function(Postid){
    if (Postid==null)
      return;
    CommentService.get({postid: Postid }, function(content){
      //need to do sth
      $rootScope.allComments = content['Comment'];
    })
  }

})

.controller('SignInCtrl', function($scope, $rootScope, $state, $ionicPopup, AuthService, $ionicLoading) {
  
  $scope.signIn = function(user) {
    
    $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });

    if ((user == null)|| (user.username==null)||(user.password == null)){
      $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });
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
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
    
  };

   $scope.forgotPw = function() {
    console.log('Forgot-pw');
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

.controller('forgetController', function($scope, $ionicPopup, $state, forgetService){


  $scope.mailValidation = function(text){
    console.log("Mail is " + text);
    if (text ==null){
      var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Please input your email!'
      });
      return;
    }
    Tjson = {"Email": text};
    forgetService.save(Tjson, function(response, code){
      if (response['success']){
        var alertPopup = $ionicPopup.alert({
        title: 'Email is accepted!',
        template: 'A new password has been sent to you.'
      });
        console.log(code);
      }
      else
        var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Unsuccessful'
      });
    });
    


  }

  $scope.cancel = function(){

    $state.go('signin');
  }



})

.controller('registerController', function($scope, $ionicPopup, $state, RegService){

  //validation

  $scope.register = function(info){
    if (info == null){
      return;
    }
    if (info.userid ==""|| info.username=="" || info.email==""||info.password==""){
      return;
    }
    var data = {'UserID': info.userid, 'Username': info.username, 'Password': info.password, 'Email': info.email};
    RegService.save(data, function(content){
      console.log(content);
        var alertPopup = $ionicPopup.alert({
        title: 'Registration is successfully!',
        template: 'You can now log in the applcation.'
      });
    })

  }


  $scope.cancel = function(){

    $state.go('signin');
  }



})


.controller('searchCon',function($scope, QueryService, $rootScope, RatingGetService, $q, HabitService, DetailIdea, AUTH_EVENTS, AuthService, $state, $ionicPopup, $ionicLoading){

    function keywordSplit(keyword){
      var kw = keyword;
      var splitedArray = kw.split(" ");
      return splitedArray;
    };

    function keywordJoin(array){
      var String = array[0];
      for (i = 1; i<array.length; i++){
        String = String + '&' + array[i];
      }

      return String;
    }

    $scope.search = function(search){
      
    $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });

      if (search.keyword == null){
        return;
      }

      var splitedArray = keywordSplit(search.keyword);
      var joinedArray = keywordJoin(splitedArray);
      QueryService.get({queries: joinedArray}, function(content1){
        console.log(content1);
        $rootScope.qdata = content1;
        $ionicLoading.hide();

        // getAllRating();

      } );

      // var jsonF = {"Query": splitedArray}; 
      // Idea.save(jsonF, function(content1){
      //   console.log(content1);
      //   $scope.searchResult = content1['Result'];
      // });
    }

  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  };


//   var getAllRating = function(){




//   var promise = [];
//   $rootScope.ratings = [];
//   angular.forEach($scope.data.Ideas, function(idea){
//     var pm = RatingGetService.get({postid: idea.id, email: '0'});
//     promise.push(pm.$promise);
//   });

//   $q.all(promise).then(function(values){
//     angular.forEach(values, function(value){
//       $rootScope.ratings.push(value.rating);
//       // console.log(value.rating)
//     });

//   });


// };

   $scope.findArray = function(id){
    // for (i=0; i< $scope.data.Ideas.length; i++){
    //   if ($scope.data.Ideas[i].id ==id){
    //     console.log(i);
    //     $rootScope.currentIndex = i;
        $rootScope.currentID = id;//same as currentPost
    //   }
    // }
    

  }




  $scope.track = function(id, username){
    console.log(id);
    console.log(username);
    <!--pass to API-->
    var data = {"Email": username, "Postid": id};
    HabitService.save(data, function(content, value){
      console.log("Habit recorded");
    });

  }

    $("#autocomplete").autocomplete({
      source: ["c++","c++","java","php","coldfusion","javascript","asp","ruby"]
    })

    $('input').keyup(function(){
      this.value = this.value.toLowerCase();
    });

       <!--login authentication-->
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('signin');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });


})


.controller("CommentController", function($scope, $rootScope,CommentService){

  $scope.commentSubmit = function(comment, postid){
    console.log("Going to submit comments");

    var userid = $rootScope.username;
    if (comment==null || comment ==="")
      return;
    var commentsS = {"Email": userid, "PostID": postid, "Content": comment};
    CommentService.save(commentsS, function(content){
      console.log(content);
      $scope.comment = null;
      $scope.newComments = content['Comment'];
      if ($scope.newComments.length >= $rootScope.allComments.length){
        for (i = $rootScope.allComments.length; i<$scope.newComments.length; i++ ){
          $rootScope.allComments.push($scope.newComments[i]);
        }
      }

    });

  };




})

.controller('CategoryController', ['$scope', '$http', function($scope,$http) {
  $scope.data = null;
  $http.get('js/data.json').success(function(abcd){
    $scope.data = abcd;
  })
  $scope.items=[];
  $scope.items[0] = "#E19D65";
  $scope.items[1] = "#737373";
  $scope.items[2] = "#079DD9";
  $scope.items[3] = "#A8D95F";
  $scope.items[4] = "#F25C5C";
  $scope.colorInitialize= function(){for (var i=5;i<100;i++){
    $scope.items[i] = $scope.items[Math.floor(Math.random()*5)];
}}
}])

.controller('RatingController', ['$scope', '$rootScope','RatingGetService','RatingPostService', function($scope, $rootScope, RatingGetService, RatingPostService) {
  $scope.rating = 0;
  RatingGetService.get({postid: $rootScope.currentID, email: $rootScope.username }, function(data){
    $scope.rating = data.rating;
  });

  $scope.star = ["grey","grey","grey","grey","grey"];
  
  isRated = false;

  $scope.changeRating = function(number){
    $scope.rating = number;
    isRated = true;
    RatingPostService.save({'Email': $rootScope.username, 'Rating': number, 'PostID': $rootScope.currentID}, function(content, status){
      console.log("rating changed");
      //get average rating
      RatingGetService.get({postid: $rootScope.currentID, email: "0" }, function(data){
        $rootScope.datum['rating'] = data.rating;
        if ($rootScope.data){
          for (i = 0; i < $rootScope.data.Ideas.length; i++){
            // console.log($rootScope.data[i].id);
            // console.log($rootScope.currentID);
            if ($rootScope.data.Ideas[i].id == $rootScope.currentID){
              $rootScope.data.Ideas[i].rating = data.rating;
              console.log("Found data in home");
              break;
            }
          }
        }
        if ($rootScope.qdata){
          for (i = 0 ;i <$rootScope.qdata.Ideas.length; i++){
            if ($rootScope.qdata.Ideas[i].id == $rootScope.currentID){
              $rootScope.qdata.Ideas[i].rating = data.rating;
              break;
            }
          }
        }

      })
    });
  }

  $scope.$watch(function(){return $scope.rating}, function(nV, oV){
   
    // console.log($rootScope.ratings[controll.info]);
    var i = 0;
    for (; i < nV; i++){
      $scope.star[i] = "gold";
    }
    for (; i <5; i++){
      $scope.star[i] = "grey";
    }
    // console.log($scope.star);
  });

  $scope.getStarColor = function(id){
    if (id <= $scope.rating){
      return "gold";
    }
    else
      return "grey";
  }
}])

.controller('UnchangeRatingController', ['$scope', '$http', '$rootScope', '$timeout', function($scope,$http, $rootScope, $timeout) {
  
  var controll = this;
  // $scope.rating = $rootScope.ratings[controll.info];

  $scope.star = ["grey","grey","grey","grey","grey"];

  $scope.$watch(function(){return controll.info}, function(nV, oV){
   
    // console.log($rootScope.ratings[controll.info]);
    var i = 0;
    for (; i < nV; i++){
      $scope.star[i] = "gold";
    }
    for (; i <5; i++){
      $scope.star[i] = "grey";
    }
    // console.log($scope.star);
  });


  
  $scope.changeRating = function(number){
    $scope.rating = number;
    isRated = true;
  }
  $scope.getStarColor = function(id){
    if (id <= $scope.rating){
      return "gold";
    }
    else
      return "grey";
  }
}])

.controller('similarTopicController', function($scope, $rootScope, $state, $ionicPopup, AuthService, AUTH_EVENTS, Idea, $ionicModal, $q, HabitService, $ionicLoading) {

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



  $scope.checkComplete = function(text, limit){
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit)!= ' '){
      limit+=1;
    }
    return limit;
  }

  $scope.recordsPerRequest = 5;
  $scope.startRecord = 0; //start from 0

  $rootScope.data = Idea.get({id:$rootScope.username, sind: $scope.startRecord, capacity: $scope.recordsPerRequest},function(content, code){
    console.log(content);
  $ionicLoading.hide();


  });



<!--infinite scroll, load more-->


  $scope.loadMore = function() {





    $scope.$boardcast('scroll.infiniteScrollComplete');
  }


  $scope.doRefresh = function(){

    $rootScope.data = null;
    $rootScope.data = Idea.get(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
    
   };

   $scope.findArray = function(id){
    // for (i=0; i< $scope.data.Ideas.length; i++){
    //   if ($scope.data.Ideas[i].id ==id){
    //     console.log(i);
        // $rootScope.currentIndex = i;
        $rootScope.currentID = id;
      // }
    // }
    

  }

  $scope.track = function(id, username){
    console.log(id);
    console.log(username);
    <!--pass to API-->
    var data = {"Email": username, "Postid": id};
    HabitService.save(data, function(content, value){
      console.log("Habit recorded");
    });
  }



  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
    //duration: 1000
  });




//rating
// var getAllRating = function(){



//   var promise = [];
//   $rootScope.ratings = [];
//   angular.forEach($scope.data.Ideas, function(idea){
//     var pm = RatingGetService.get({postid: idea.id, email: '0'});
//     promise.push(pm.$promise);
//   });

//   $q.all(promise).then(function(values){
//     angular.forEach(values, function(value){
//       $rootScope.ratings.push(value.rating);

//     });

//   });


// };

// $scope.interpolation = function(value){
//   return $interpolate(value)($scope);
// };

})

.controller('feedbackController', function($scope, $ionicPopup, $state){

  $scope.feedback = function(feedback){
    var data = {'Title': feedback.title, 
      'Details': feedback.detail};
    
    var alertPopup = $ionicPopup.alert({
      title: 'Sent',
      template: 'Your Feedback is well received.'
      });
    }
  })

;