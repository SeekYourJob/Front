'use strict';

angular.module('cvsApp').controller('AccountCtrl', ['$scope', 'AuthService', '$state', function($scope) {

  $scope.init = function() {
    console.log('Triggered from AccountCtrl!');
  };

  $scope.init();

}]);