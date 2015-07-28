'use strict';

angular.module('cvsApp').controller('LoginCtrl', ['$scope', '$auth', '$state', function($scope, $auth) {

  $scope.credentials = {
    email: '',
    password: ''
  };

  $scope.init = function() {
    console.log('Triggered from Login!');
  };

  $scope.init();

  $scope.login = function() {
    $auth.login($scope.credentials).then(function(data) {
      console.log('HOORAY!', data);
    });
  };

}]);