'use strict';

angular.module('cvsApp').controller('AccountCtrl', ['$scope', 'AuthService', '$state', function($scope, AuthService) {

  AuthService.needsAccess();

  $scope.init = function() {
    console.log('Triggered from AccountCtrl!');
  };

  $scope.init();

}]);