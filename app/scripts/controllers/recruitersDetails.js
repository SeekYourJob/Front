'use strict';

angular.module('cvsApp').controller('RecruitersDetailsCtrl', ['$scope', '$state', 'Restangular',
  function($scope, $state, Restangular) {

    $scope.recruiter = {};
    $scope.companies = [];

    // Recruiter details
    Restangular.one("recruiters", $state.params.id).get().then(function(recruiter) {
      $scope.recruiter = recruiter;
    });

    // Companies
    Restangular.all('companies').getList().then(function(companies) {
      $scope.companies = companies;
    });

    // Saving updated recruiter
    $scope.updateRecruiter = function() {
      $scope.recruiter.put();
    };

  }]);