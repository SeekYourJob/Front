'use strict';

angular.module('cvsApp').controller('AccountCandidateCtrl',
  ['$scope',
    function($scope) {

      $scope.user = $scope.$parent.user;

    }
  ]
);