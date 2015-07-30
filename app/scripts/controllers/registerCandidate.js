'use strict';

angular.module('cvsApp').controller('RegisterCandidateCtrl', ['$scope', function($scope) {

  $scope.init = function() {
    console.log('Triggered from a controller!');
  };

  $scope.init();

}]);