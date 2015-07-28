'use strict';

angular.module('cvsApp').controller('LoginCtrl', ['$scope', function($scope) {

  $scope.auth = {
    email: '',
    password: ''
  };

  $scope.init = function() {
    console.log('Triggered from Login!');
  };

  $scope.init();

}]);
