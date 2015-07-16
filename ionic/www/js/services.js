angular.module('starter.services', []).factory('Idea', function($resource) {
  return $resource('http://localhost:port/api/ideas/:id', { port: ':5000', id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
})

.factory('authentication', function($resource){
	return $resource('http://localhost:port/api/login', { port: ':5000' });
})
.factory('forgetService', function($resource){
  return $resource('http://localhost:port/api/login/forget', {port: ':5000'});
})

.service('AuthService', function($q, $http, USER_ROLES, authentication) {
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
        var data = { "Username": name, "Password": hex_md5(pw)};
        console.log(data["Password"]);
        authentication.save(data, function(content1){
        	console.log(content1);
        	storeUserCredentials(name, content1['Token']);
        	resolve('Login success.');

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


.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});;