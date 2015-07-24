// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.service.core', 'ionic.service.analytics', 'ngResource','starter.controllers', 'starter.services','starter.directives', 'ngAnimate'])

.run(function($ionicPlatform, $ionicAnalytics) {
  $ionicPlatform.ready(function() {
    $ionicAnalytics.register();
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
        templateUrl: "templates/category.html"
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
        templateUrl: "templates/feedback.html"
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
}]);
