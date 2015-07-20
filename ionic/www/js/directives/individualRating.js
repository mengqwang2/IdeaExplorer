app.directive('individualRating', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      info: '=' 
    }, 
    templateUrl: 'js/directives/individualRating.html' 
  }; 
});