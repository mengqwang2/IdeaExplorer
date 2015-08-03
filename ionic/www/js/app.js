// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.service.core', 'ngResource','starter.controllers', 'starter.services','starter.directives', 'ngAnimate'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // $ionicAnalytics.register();
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicAppProvider) {
  $ionicAppProvider.identify({
  app_id: 'f06af2ba',
  api_key: 'abc48474c87cd1a24d85b53d186e1321772dcfc6403c9fe5'
});

  $stateProvider

  .state('signin', {
      url: '/sign-in',
      templateUrl: 'templates/sign-in.html',
      controller: 'SignInCtrl'
    })

   .state('forgotpw', {
      url: '/forgot-pw',
      templateUrl: 'templates/forgot.html',
      controller: 'forgetController'
    })

   .state('register', {
      url: '/register',
      templateUrl: 'templates/register.html',
      controller: 'registerController'
    })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: 'searchCon'
        
      }
    }
    
  })

  .state('app.category', {
    url: "/category",
    views: {
      'menuContent': {
        templateUrl: "templates/category.html",
        controller: "CategoryController"
      }
    }
  })
    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html",
          controller: 'home'
        }
      }
    })
      .state('app.details', {
      url: "/home/:id",
      views: {
        'menuContent': {
          templateUrl: "templates/details.html",
          controller: "DetailController"
        }
      }
    })

      .state('app.setting', {
    url: "/setting",
    views: {
      'menuContent': {
        templateUrl: "templates/setting.html",
        controller: "SettingCtrl"
      }
    }
  })
      .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html"
      }
    }
  })

      .state('app.feedback', {
    url: "/feedback",
    views: {
      'menuContent': {
        templateUrl: "templates/feedback.html",
        controller: "FeedbackCtrl"
      }
    }
  })


      .state('app.searchpage',{
        url: "/tagSearch/:id",
        views: {
          'menuContent':{
            templateUrl: "templates/pageOfresult.html",
            controller: 'tagSearchCon'
          }
        }
      });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sign-in');



})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
 
 
    if (!AuthService.isAuthenticated()) {
      console.log("notAuthenticated");
      if (next.name !== 'signin'&& next.name !== 'forgotpw'&&next.name!== 'register') {
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
        event.preventDefault();
        $state.go('signin');
      }
    }
  });


})

.run(['$ionicHistory', 'AuthService', '$rootScope', function($ionicHistory, AuthService, $rootScope){
    $rootScope.logout = function(){
    console.log('Clicked logout');
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    $rootScope.data = {};
    $rootScope.datum = {};
    $rootScope.qdata = {};
    AuthService.logout();
  };

  $rootScope.dataSource =[];
  $rootScope.detailSource=[];
  // helper function
  $rootScope.pushDatum = function(extData){
    var mykey =-1;
    angular.forEach($rootScope.dataSource, function(datum, key){
      if (datum.id == extData.id){
        mykey = key;
      }
    });
    if (mykey == -1){
      $rootScope.dataSource.push(extData);
      return ($rootScope.dataSource.length-1);
    }
    else
      return mykey;
  };

  $rootScope.pushData = function(extArray){
    var list = [];
    angular.forEach(extArray, function(inputItem, key){
      list.push($rootScope.pushDatum(inputItem));
    })

    return list;

  }

  $rootScope.listOfReference = function(extArray){
    var listOfIdeas =[];
    var templist = $rootScope.pushData(extArray);
    angular.forEach(templist, function(num){
      listOfIdeas.push($rootScope.dataSource[num]);
    });
    return listOfIdeas;

  }


  $rootScope.allComments = [];
  $rootScope.insertAllComments = function(passcom, passid){
    var inserted = false;
    angular.forEach($rootScope.allComments, function(comment){
      if (comment.id == passid){
        comment.content = passcom;
        inserted = true;
        return;
      }
    });
    if (!inserted)
      $rootScope.allComments.push({'id': passid, 'content': passcom});
  }

  $rootScope.retrieveComments = function(id){
    var commentCon;
    angular.forEach($rootScope.allComments, function(comment,key){
      if (comment.id == id){
        commentCon = comment.content;
        return;
      }
    });
    return commentCon;

  }



  $rootScope.pushDetail = function(extData){
    var mykey = -1;
    angular.forEach($rootScope.detailSource, function(datum, key){
      if (datum.id == extData.id){
        mykey = key;  
      }
    });
    if (mykey==-1){
      $rootScope.detailSource.push(extData);
      return $rootScope.detailSource[($rootScope.detailSource.length-1)];
    }
    else{
      return $rootScope.detailSource[mykey];
    }
    
  };

  $rootScope.changeARating = function(postid, rate){
    console.log(postid);

    angular.forEach($rootScope.detailSource, function(detail){
      console.log(detail.id)
      if (postid == detail.id){
        console.log("changing detail's rating");
        detail.rating = rate;
      }
    });

    angular.forEach($rootScope.dataSource, function(datum){
      if (datum.id == postid){
        datum.rating = rate;
      }
    });

  }

  $rootScope.inRateSource = [];
  $rootScope.changeInRating = function(postid, rate){
    var found = false;
    angular.forEach($rootScope.inRateSource, function(record){
      if (record.id == postid){
        found = true;
        record.value = rate;
      }
    });
    if (!found){
      $rootScope.inRateSource.push({id: postid, value: rate});
    }
  }

  $rootScope.getInRating = function(postid){
    var rate = 0;
    angular.forEach($rootScope.inRateSource, function(record){
      if (record.id ==postid){
        rate = record.value;
      }
    });
    return rate;
  }



}]);
