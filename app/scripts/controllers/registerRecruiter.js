'use strict';

angular.module('cvsApp').controller('RegisterRecruiterCtrl', ['$scope', function($scope) {

  $scope.newRecruiter = {
    user: {},
    recruiter: {
      availability: 'all'
    }
  };

  $scope.register = function() {
    console.log('we need to register this new recruiter!');
  };

}]);