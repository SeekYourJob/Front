'use strict';

angular.module('cvsApp').controller('CompaniesDetailsCtrl', ['$scope', '$state', 'Restangular',
  function($scope, $state, Restangular) {

    $scope.$watch('company.name', function(oldValue, newValue) {
      if (typeof oldValue !== 'undefined' && typeof newValue !== 'undefined'  && newValue !== '') {
        $scope.update();
      }
    });

    // Company details
    Restangular.one("companies", $state.params.id).get().then(function(company) {
      $scope.company = company;
    });

    // Recruiters
    Restangular.one("companies", $state.params.id).getList('recruiters').then(function(recruiters) {
      $scope.recruiters = recruiters;
    });

    $scope.update = function() {
      $scope.company.put();
    };

  }]);