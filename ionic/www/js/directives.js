angular.module('starter.directives', [])
  .directive('compareTo', [function () {
return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };
  }])


.directive('individualRating', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      info: '=' 
    }, 
    templateUrl: 'js/directives/individualRating.html',
    controller : 'RatingController',
    controllerAs: 'RatCon',
    bindToController:true
  }; 
})


.directive('rating', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      info: '=' 
    }, 
    templateUrl: 'js/directives/rating.html',
    controller: 'UnchangeRatingController',
    controllerAs: 'unRatCon',
    bindToController:true
  }; 
})


.directive('searchResult', function(){
  return{
    restrict: 'A',
    templateUrl: 'js/directives/searchResult.html',

  };

});