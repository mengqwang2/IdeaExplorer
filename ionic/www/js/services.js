angular.module('starter.services', [])

.factory('Idea', function($resource) {
  return $resource('http://10.43.74.245:port/api/ideas/id=:id&start=:sind&cap=:capacity', { port: ':5000', id: '@_id', sind: '@start', capacity: '@capacity' });
})

.factory('authentication', function($resource){
	return $resource('http://10.43.74.245:port/api/login', { port: ':5000' });
})
.factory('forgetService', function($resource){
  return $resource('http://10.43.74.245:port/api/login/forget', {port: ':5000'});
})

.factory('QueryService', function($resource){
  return $resource('http://10.43.74.245:port/api/ideas/query=:queries&start=:sind&cap=:capacity&sort=:sortMethod&filt=:filter&email=:mail', {port: ':5000', queries: '@_querystring', sind: '@start', capacity: '@capacity', sortMethod: 'relevance', filter: 'all', mail: '@mymail'});
})


.factory('RegService', function($resource){
  return $resource('http://10.43.74.245:port/api/reg', { port: ':5000' });
})

.factory('CommentService', function($resource){
  return $resource('http://10.43.74.245:port/api/ideas/comment/:postid', {port: ':5000', postid: '@_id'});
})

.factory('RatingPostService', function($resource){
  return $resource('http://10.43.74.245:port/api/ideas/rating', {port: ':5000'});
})

.factory('RatingGetService', function($resource){
  return $resource('http://10.43.74.245:port/api/ideas/rating/:postid/:email', {port: ':5000', postid: '@id', email: '@email'});
})

.factory('InterestService', function($resource){
  return $resource('http://10.43.74.245:port/api/user/interest/email=:mail&interest=:tag', {port: ':5000', mail:'@email', tag: '0'},
    {
      delete_tag:{
        method: 'DELETE'
      }
    });
})

.factory('DetailIdea', function($resource){
  return $resource('http://10.43.74.245:port/api/ideas/details/:id&:email', {port: ':5000', id: '@id', email:'@email'});
})

.factory('CategoryService', function($resource){
  return $resource('http://10.43.74.245:port/api/category', {port: ':5000'});
})

.factory('SimilarService', function($resource){
  return $resource('http://10.43.74.245:port/api/ideas/relevant/:postid', {port: ':5000', postid: '@_id'});
})

.service('AuthService', function($q, $http, USER_ROLES, authentication, $rootScope) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(name, token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(name, token);
  }
 
  function useCredentials(name, token) {
    username = name;
    isAuthenticated = true;
    authToken = token;
 
    if (username == 'admin') {
      role = USER_ROLES.admin
    }
    if (username == 'user') {
      role = USER_ROLES.public
    }
 
    // Set the token as header for your requests!
    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['Authorization'] = token;
  }
 
  function destroyUserCredentials() {
  	console.log("destroying");
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['Authorization'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var login = function(name, pw) {
  	console.log("login");
    return $q(function(resolve, reject) {
      if (name !== '' && pw !== '' ) {
        // Make a request and receive your auth token from your server
        var data = { "Email": name, "Password": hex_md5(pw)};
        console.log(data["Password"]);
        console.log(data['Email']);
        authentication.save(data, function(content1){
        	console.log(content1);
          if (content1['state'] !== "Login successfully"){
            reject('Login Failed');
          }
          else{
            $rootScope.fullname = content1['name'];
            storeUserCredentials(name, content1['Token']);
            resolve('Login success.');
          }
        	
        }, function(error){
          reject('Login Failed');
        });

      } else {
        reject('Login Failed.');
      }
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})


// .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
//   return {
//     responseError: function (response) {
//       $rootScope.$broadcast({
//         400: AUTH_EVENTS.badRequest,
//         401: AUTH_EVENTS.notAuthenticated,
//         403: AUTH_EVENTS.notAuthorized,
//         404: AUTH_EVENTS.notFound,
//         450: AUTH_EVENTS.requestError,
//         500: AUTH_EVENTS.internalError
//       }[response.status], response);
//       return $q.reject(response);
//     }
//   };
// })

.factory('fireStatus', function($rootScope, AUTH_EVENTS){
  return function(code){
    console.log(code);
    switch(code){
      case 400: $rootScope.$broadcast(AUTH_EVENTS.badRequest);
            break;
      case 401: $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            break;
      case 403: $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            break;
      case 404: $rootScope.$broadcast(AUTH_EVENTS.notFound);
            break;
      case 405: break;
      case 450: $rootScope.$broadcast(AUTH_EVENTS.requestError);
            break;
      case 500: $rootScope.$broadcast(AUTH_EVENTS.internalError);
            break;
      default:
        $rootScope.$broadcast(AUTH_EVENTS.otherErrors);
    }

  }
})
 
// .config(function ($httpProvider) {
//   $httpProvider.interceptors.push('AuthInterceptor');
// })

.factory('listenStatus', function($rootScope, AUTH_EVENTS, $state, AuthService, $ionicPopup){
  return function(loading, scope){
    scope.$on(AUTH_EVENTS.notAuthenticated, function(event){
      console.log(1);
      if (loading != null)
        loading.hide();

        var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
        });
        alertPopup.then(function(res){
          $rootScope.logout();
        });  
      
    });

    scope.$on(AUTH_EVENTS.notFound, function(event){
      console.log(2);
      if (loading != null)
        loading.hide();

      var alertPopup = $ionicPopup.alert({
      title: 'Error!',
      template: 'Unable to retrieve the content.'
      }); 
    });

    scope.$on(AUTH_EVENTS.internalError, function(event){
      console.log(3);
      if (loading != null)
        loading.hide();

      var alertPopup = $ionicPopup.alert({
      title: 'Internal Server Error!',
      template: 'Please contact the administrator.'
      }) 
    });

    scope.$on(AUTH_EVENTS.requestError, function(event){
      console.log(4);
      if (loading != null)
        loading.hide();

      var alertPopup = $ionicPopup.alert({
      title: 'Error!',
      template: 'Unable to handle the request.'
      }) ;
    });

    scope.$on(AUTH_EVENTS.badRequest, function(event){
      console.log(5);
      if (loading != null)
        loading.hide();
      var alertPopup = $ionicPopup.alert({
      title: 'Error!',
      template: 'The request cannot be satisfied.'
      }) ;
    });

    scope.$on(AUTH_EVENTS.otherErrors, function(event){
      console.log(6);
      if (loading != null)
        loading.hide();
      var alertPopup = $ionicPopup.alert({
      title: 'Error!',
      template: 'Please contact the administrator.'
      }) ;
      alertPopup.then(function(res){
      $rootScope.logout();
      });
    });


  };
});

