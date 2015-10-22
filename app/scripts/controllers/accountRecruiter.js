'use strict';

angular.module('cvsApp').controller('AccountRecruiterCtrl',
  ['$scope',
    function($scope) {

      $scope.user = $scope.$parent.user;

      $scope.setSelectedAccountInterview = function(interview) {
        $scope.selectedAccountInterview = interview;
      };

    }

  ]
);