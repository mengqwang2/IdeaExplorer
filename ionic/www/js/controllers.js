angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


})


.controller('home', function($scope, $rootScope, $state, Idea, $ionicModal, $ionicLoading, listenStatus, fireStatus, AuthService) {

  $rootScope.username = AuthService.username();


  listenStatus($ionicLoading, $scope);

  $scope.setCurrentUsername = function(name) {
    $rootScope.username = name;
  };

  //return the optimal size of a passage
  $scope.checkComplete = function(text, limit) {
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit) != ' ') {
      limit += 1;
    }
    return limit;
  }

  //for loading ideas page by page
  $scope.recordsPerRequest = 5;
  $scope.startRecord = 0; //start from 0
  $scope.terminate = false;
  $scope.displayButton = false;

  Idea.get({
    id: $rootScope.username,
    sind: $scope.startRecord,
    capacity: $scope.recordsPerRequest,
    cache: $rootScope.cacheSignal
  }, function(content, code) {
    console.log(content);
    $rootScope.cacheSignal = 0;
    $ionicLoading.hide();
    var temp = $rootScope.listOfReference(content.Ideas)
    console.log(temp);
    $scope.data = {
      'Ideas': temp
    };
    $scope.startRecord = content["eind"] + 1; //set the new start index
    $scope.size = content["size"]; //total number of records
    $scope.displayButton = true;


  }, function(error) {
    fireStatus(error.status);
  });


  //load more ideas when the users click the button
  $scope.loadMore = function() {
    $scope.displayButton = false;
    console.log("Trying to load more");
    console.log($scope.startRecord);
    if ($scope.startRecord < $scope.size) {
      Idea.get({
        id: $rootScope.username,
        sind: $scope.startRecord,
        capacity: $scope.recordsPerRequest,
        cache: $rootScope.cacheSignal
      }, function(content, code) {
        console.log(content);
        var temp = $rootScope.listOfReference(content.Ideas)
        angular.forEach(temp, function(record) {
          $scope.data.Ideas.push(record);
        })
        $scope.startRecord = content["eind"] + 1;
        $scope.capacity = content["capacity"];
        $scope.displayButton = true;

      }, function(error) {
        fireStatus(error.status);
      })
    }

    $scope.$broadcast('scroll.infiniteScrollComplete');
  }

  //prepare for loading a detailed idea
  $scope.findArray = function(ids) {
    $rootScope.currentID = ids;
    $state.go('app.details', {
      id: ids
    }, {
      reload: true
    });
  }

  //show the loading icon while the app is accessing the server
  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true

  });


})

.controller('DetailController', function($scope, $rootScope, DetailIdea, AuthService, AUTH_EVENTS, $ionicPopup, $state, $ionicModal, CommentService, $ionicLoading, SimilarService, listenStatus, fireStatus) {

  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
      //duration: 1000
  });



  $scope.displayButton = false;
  DetailIdea.get({
    id: $rootScope.currentID,
    email: $rootScope.username
  }, function(returndata) {
    console.log(returndata);
    $scope.datum = $rootScope.pushDetail(returndata);
    // $scope.datum = $rootScope.datum;
    $scope.currentID = $rootScope.currentID;
    $ionicLoading.hide();

  }, function(error) {
    fireStatus(error.status);
  });

  $scope.sections = [
    ['Background', 'rtc'],
    ['Details', 'description'],
    ['Practical Problems Solved', 'pps'],
    ['Success Benefits', 'success_benefit']
  ];

  $scope.show_section = {
    "rtc": false,
    "description": false,
    "pps": false,
    "success_benefit": false
  };
  $scope.section_select = function(section, $event) {
    $scope.show_section[section] = !$scope.show_section[section];
    $scope.$broadcast('scroll.resize');
  };

  $scope.showSimilar = false;
  $scope.loadedSimilar = false;
  $scope.similartopic = function() {
    $scope.showSimilar = !$scope.showSimilar;
    if (!$scope.loadedSimilar) {
      $ionicLoading.show({
        template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
        animation: 'fade-in',
        showBackdrop: true,
        maxwidth: 200,
        hideOnStateChange: true
          //duration: 1000
      });



      SimilarService.get({
        postid: $scope.currentID
      }, function(content) {
        var temp = $rootScope.listOfReference(content.Ideas);
        $scope.qdata = {
          'Ideas': temp
        };
        $ionicLoading.hide();
        $scope.loadedSimilar = true;

      }, function(error) {
        fireStatus(error.status);
      });
    }

  };





  $scope.findKeyword = function(word) {

    $rootScope.keyword = word;
    $rootScope.processWord = word;
    $rootScope.sortingMethod = 'relevance';
    $rootScope.filterMethod = 'all';
    $state.go('app.searchpage', {
      id: word
    })
  }


  $scope.findArray = function(ids) {

    $rootScope.currentID = ids; //same as currentPost
    $state.go('app.details', {
      id: ids
    });
  }

  listenStatus($ionicLoading, $scope);


  <!--comments related-->
  $scope.loadComments = function(Postid) {
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
  var commentRetrieve = function(Postid) {
    if (Postid == null)
      return;
    console.log(Postid);
    CommentService.get({
      postid: Postid
    }, function(content) {
      //need to do sth
      console.log(content);
      $rootScope.insertAllComments(content['Comment'], Postid);

      $scope.allComments = $rootScope.retrieveComments(Postid);
      console.log($rootScope.allStoredComments);
    }, function(error) {
      fireStatus(error.status);
    })
  };

  $scope.commentSubmit = function(comment, postid) {
    console.log("Going to submit comments");

    var userid = $rootScope.username;
    if (comment == null || comment === "")
      return;
    console.log(userid);
    console.log(postid);
    console.log(comment);
    var commentsS = {
      "Email": userid,
      "PostID": postid,
      "Content": comment
    };
    console.log(commentsS.PostID);
    CommentService.save(commentsS, function(content) {
      console.log(content);
      $scope.comment = null; //clear the field
      $rootScope.insertAllComments(content['Comment'], postid);
      $scope.allComments = $rootScope.retrieveComments(postid);
    }, function(error) {
      fireStatus(error.status);
    });

  };


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

    if ((user == null) || (user.username == null) || (user.password == null)) {
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
      return;
    }

    AuthService.login(user.username, user.password).then(function(authenticated) {
      user.username = "";
      user.password = "";
      console.log("logging in");
      $state.go('app.home', {}, {
        reload: true
      });

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

.controller('forgetController', function($scope, $ionicPopup, $state, forgetService) {


  $scope.mailValidation = function(text) {
    console.log("Mail is " + text);
    if (text == null) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Please input your email!'
      });
      return;
    }
    Tjson = {
      "Email": text
    };
    forgetService.save(Tjson, function(response, code) {
      if (response['success']) {
        var alertPopup = $ionicPopup.alert({
          title: 'Email is accepted!',
          template: 'A new password has been sent to you.'
        });
        console.log(code);
      } else
        var alertPopup = $ionicPopup.alert({
          title: 'Error!',
          template: 'Unsuccessful'
        });
    });



  }

  $scope.cancel = function() {

    $state.go('signin');
  }



})

.controller('registerController', function($scope, $ionicPopup, $state, RegService, AuthService, $rootScope) {

  //validation

  $scope.register = function(info) {
    if (info == null) {
      return;
    }
    if (info.userid == "" || info.username == "" || info.email == "" || info.password == "") {
      return;
    }
    var data = {
      'UserID': info.userid,
      'Username': info.username,
      'Password': hex_md5(info.password),
      'Email': info.email
    };
    RegService.save(data, function(content) {
      console.log(content);
      var alertPopup = $ionicPopup.alert({
        title: 'Registration is successfully!',
        template: 'You can now log in the applcation.'
      });
      alertPopup.then(function(res) {
        AuthService.login(info.email, info.password).then(function(authenticated) {
          $state.go('app.home', {}, {
            reload: true
          });
          $scope.setCurrentUsername(info.email);
        }, function(err) {
          // $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: 'Login failed!',
            template: 'Please check your credentials!'
          });
        });
      });

    }, function(error) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Cannot register!'
      });
    })

  }

  $scope.setCurrentUsername = function(name) {
    $rootScope.username = name;
  };

  $scope.cancel = function() {

    $state.go('signin');
  }



})


.controller('searchCon', function($scope, QueryService, $rootScope, RatingGetService, $q, DetailIdea, $state, $ionicPopup, $ionicLoading, listenStatus, fireStatus) {

  function keywordSplit(keyword) {
    var kw = keyword;
    var splitedArray = kw.split(" ");
    return splitedArray;
  };

  function keywordJoin(array) {
    var String = array[0];
    for (i = 1; i < array.length; i++) {
      String = String + '&' + array[i];
    }

    return String;
  }

  //search settings
  $scope.recordsPerRequest = 5;
  $scope.startRecord = 0; //start from 0
  $scope.terminate = false;
  $scope.displayButton = false;


  $scope.search = function(search) {
    $scope.displayButton = false;
    $scope.startRecord = 0;

    if (search.keyword == null) {
      $ionicLoading.hide();
      return;
    }

    search.keyword = search.keyword.toLowerCase();
    $rootScope.keyword = search.keyword;
    var splitedArray = keywordSplit(search.keyword);
    $scope.joinedArray = keywordJoin(splitedArray);
    var sortingMethod = search.order;
    if (sortingMethod == null) {
      sortingMethod = "relevance";
    }
    var searchFilter = search.date;
    if (searchFilter == null){
      searchFilter = "all";
    }
    $rootScope.sortingMethod = sortingMethod;
    $rootScope.filterMethod = searchFilter;
    $rootScope.processWord = $scope.joinedArray;
    console.log(sortingMethod);

    var d = new Date();

    $state.go('app.searchpage', {
      id: $scope.processWord + d.toLocaleTimeString()
    });
  }






  $scope.checkComplete = function(text, limit) {
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit) != ' ') {
      limit += 1;
    }
    return limit;
  };




  $scope.findArray = function(ids) {

    $rootScope.currentID = ids; //same as currentPost
    $state.go('app.details', {
      id: ids
    });
  };

  listenStatus($ionicLoading, $scope);


})





.controller('CategoryController', function($scope, CategoryService, $ionicPopup, $rootScope, $state, $ionicLoading, listenStatus, fireStatus) {

  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
      //duration: 1000
  });

  $scope.Category = null;

  CategoryService.query(function(content) {
    console.log(content);
    $scope.Category = content;
    $ionicLoading.hide();
  }, function(error) {
    fireStatus(error.status);
  });

  $scope.items = [];
  $scope.items[0] = "#E19D65";
  $scope.items[1] = "#737373";
  $scope.items[2] = "#079DD9";
  $scope.items[3] = "#A8D95F";
  $scope.items[4] = "#F25C5C";
  $scope.colorInitialize = function() {
    for (var i = 5; i < 100; i++) {
      $scope.items[i] = $scope.items[Math.floor(Math.random() * 5)];
    }
  };

  $scope.findKeyword = function(word) {
    $rootScope.keyword = word;
    $rootScope.processWord = word;
    $rootScope.sortingMethod = 'relevance';
    $rootScope.filterMethod = 'all';
    $state.go('app.searchpage', {
      id: word
    }, {
      reload: true
    });

  };

  listenStatus($ionicLoading, $scope);
})



.controller('RatingController', function($scope, $rootScope, RatingGetService, RatingPostService, $ionicPopup, fireStatus) {
  console.log(this.info);
  $scope.currentID = this.info;
  $scope.rating = 0;
  //get individual rating
  RatingGetService.get({
    postid: $scope.currentID,
    email: $rootScope.username
  }, function(data) {
    $rootScope.changeInRating($scope.currentID, data.rating);
    $scope.rating = $rootScope.getInRating($scope.currentID);
  }, function(error) {

    fireStatus(error.status);
  });

  $scope.star = ["grey", "grey", "grey", "grey", "grey"];

  var isRated = false;

  $scope.changeRating = function(number) {
    console.log(number);
    $scope.rating = number;
    isRated = true;


    RatingPostService.save({
      'Email': $rootScope.username,
      'Rating': number,
      'PostID': $scope.currentID
    }, function(content, status) {
      console.log("rating changed");
      //get average rating for the idea whose rating is changed
      RatingGetService.get({
        postid: $scope.currentID,
        email: "0"
      }, function(data) {
        $rootScope.changeARating($scope.currentID, data.rating);
        console.log($rootScope.detailSource);

      }, function(error) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: 'Unable to retrieve the rating!'
        });

      })
    }, function(error) {
      var alertPopup = $ionicPopup.alert({
        title: 'Error',
        template: 'Unable to save the rating!'
      });
    });
  }

  //display the changes when the value of rating changes
  $scope.$watch(function() {
    return $scope.rating
  }, function(nV, oV) {

    var i = 0;
    for (; i < nV; i++) {
      $scope.star[i] = "gold";
    }
    for (; i < 5; i++) {
      $scope.star[i] = "grey";
    }
  });

  $scope.getStarColor = function(id) {
    if (id <= $scope.rating) {
      return "gold";
    } else
      return "grey";
  }
})

.controller('UnchangeRatingController', function($scope, $rootScope) {

  var controll = this;

  $scope.star = ["grey", "grey", "grey", "grey", "grey"];

  //display the changes when the value of rating changes
  $scope.$watch(function() {
    return controll.info
  }, function(nV, oV) {

    var i = 0;
    for (; i < nV; i++) {
      $scope.star[i] = "gold";
    }
    for (; i < 5; i++) {
      $scope.star[i] = "grey";
    }
  });


  $scope.changeRating = function(number) {
    $scope.rating = number;
    isRated = true;
  }
  $scope.getStarColor = function(id) {
    if (id <= $scope.rating) {
      return "gold";
    } else
      return "grey";
  }
})




.controller("tagSearchCon", function($scope, QueryService, $rootScope, $ionicLoading, $ionicPopup, $state, listenStatus, fireStatus) {



  //search settings
  $scope.recordsPerRequest = 5;
  $scope.startRecord = 0; //start from 0
  $scope.terminate = false;
  $scope.displayButton = false;
  $scope.keyword = $rootScope.keyword; //for display
  $scope.sortingMethod = $rootScope.sortingMethod;
  $scope.processWord = $rootScope.processWord;
  $scope.filterMethod = $rootScope.filterMethod;
  console.log($scope.filterMethod);
  //invoke the api to get the search result
  QueryService.get({
    queries: $scope.processWord,
    sind: $scope.startRecord,
    capacity: $scope.recordsPerRequest,
    sortMethod: $scope.sortingMethod,
    filter: $scope.filterMethod,
    mail:$rootScope.username
  }, function(content1) {
    console.log(content1);
    $ionicLoading.hide();
    if (content1.Ideas.length ==0){
        var alertPopup = $ionicPopup.alert({
        title: 'Info',
        template: 'No ideas are found.'
        });
        $scope.displayButton = false;
        return;

    }
    var temp = $rootScope.listOfReference(content1.Ideas);
    $scope.qdata = {
      'Ideas': temp
    };
    $scope.startRecord = content1["eind"] + 1;
    $scope.size = content1["size"]; //total number of records
    $scope.displayButton = true;


  }, function(error) {
    fireStatus(error.status);

  });


  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
      //duration: 1000
  });

  listenStatus($ionicLoading, $scope);

  <!--infinite scroll, load more-->


  $scope.loadMore = function() {
    $scope.displayButton = false;
    console.log("Trying to load more");
    console.log($scope.startRecord);
    if ($scope.startRecord < $scope.size) {
      QueryService.get({
        queries: $scope.keyword,
        sind: $scope.startRecord,
        capacity: $scope.recordsPerRequest,
        sortMethod: $scope.sortingMethod,
        filter: $scope.filterMethod,
        mail: $rootScope.username
      }, function(content, code) {
        console.log(content);
        var temp = $rootScope.listOfReference(content.Ideas);
        angular.forEach(temp, function(record) {
          $scope.qdata.Ideas.push(record);
        })
        $scope.startRecord = content["eind"] + 1;
        $scope.capacity = content["capacity"];
        $scope.displayButton = true;



      }, function(error) {
        fireStatus(error.status);
      })
    }


    $scope.$broadcast('scroll.infiniteScrollComplete');
  }


  $scope.checkComplete = function(text, limit) {
    if (text.length <= limit)
      return text.length;
    while (text.charAt(limit) != ' ') {
      limit += 1;
    }
    return limit;
  };

  $scope.findArray = function(ids) {

    $rootScope.currentID = ids; //same as currentPost
    $state.go('app.details', {
      id: ids
    });

  }


})

.controller('SettingCtrl', function($scope, InterestService, $rootScope, fireStatus, $ionicLoading, listenStatus) {

  $ionicLoading.show({
    template: '<ion-spinner icon="lines" class="spinner-positive"></ion-spinner>',
    animation: 'fade-in',
    showBackdrop: true,
    maxwidth: 200,
    hideOnStateChange: true
      //duration: 1000
  });


  $scope.onItemDelete = function(item) {
    
    InterestService.delete_tag({mail: $rootScope.username, tag: item}, function(content){
      $ionicLoading.hide();
      $scope.items.splice($scope.items.indexOf(item), 1);
      $rootScope.cacheSignal = 1;
    }, function(error){
      $ionicLoading.hide();
      fireStatus(error.status);
    });
  };

  InterestService.query({mail: $rootScope.username},function(content){
    console.log(content);
    $ionicLoading.hide();
    $scope.items =content;
  }, function(error){
    console.log(error);
    fireStatus(error.status);
  });

  listenStatus($ionicLoading, $scope);
  // $scope.items = [{
  //     id: 0
  //   }, {
  //     id: 1
  //   }, {
  //     id: 2
  //   }, {
  //     id: 3
  //   }, {
  //     id: 4
  //   }, {
  //     id: 5
  //   }, {
  //     id: 6
  //   }, {
  //     id: 7
  //   }, {
  //     id: 8
  //   }, {
  //     id: 9
  //   }, {
  //     id: 10
  //   }, {
  //     id: 11
  //   }, {
  //     id: 12
  //   }, {
  //     id: 13
  //   }, {
  //     id: 14
  //   }, {
  //     id: 15
  //   }, {
  //     id: 16
  //   }, {
  //     id: 17
  //   }, {
  //     id: 18
  //   }, {
  //     id: 19
  //   }, {
  //     id: 20
  //   }

  // ];

})

.controller('FeedbackCtrl', function($scope, $ionicPopup) {
  $scope.sendEmail = function(subject, body) {
    var link = "mailto:test@123.com" + "?subject=New%20email " + escape(subject) + "&body=" + escape(body);

    window.location.href = link;

    var alertPopup = $ionicPopup.alert({
      title: 'Sent',
      template: 'Your Feedback is well received.'
    });
  };
});