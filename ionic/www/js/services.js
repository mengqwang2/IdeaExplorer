angular.module('starter.services', []).factory('Idea', function($resource) {
  return $resource('http://localhost:port/api/ideas/:id', { port: ':5000', id: '@_id' }, {
    update: {
      method: 'PUT'
    }
  });
});