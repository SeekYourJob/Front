'use strict';

angular.module('cvsApp').controller('AccountRecruiterCtrl',
  ['$scope',
    function($scope) {

      $scope.user = $scope.$parent.user;
      $scope.accountPopover = {templateUrl: 'popover.html'};

      $scope.setSelectedAccountInterview = function(interview) {
        $scope.selectedAccountInterview = interview;
      };

    }

  ]
);