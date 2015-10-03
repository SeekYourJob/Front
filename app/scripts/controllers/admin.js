'use strict';

angular.module('cvsApp').controller('AdminCtrl', ['$scope', 'Restangular',
  function($scope, Restangular) {

    $scope.slots = false;
    $scope.interviewsByCompanies = false;

    Restangular.all('interviews/slots').getList().then(function(slots) {
      $scope.slots = slots.plain();

      Restangular.all('interviews').getList().then(function(interviewsByCompanies) {
        $scope.interviewsByCompanies = interviewsByCompanies.plain();

        console.log($scope.slots);
        console.log($scope.interviewsByCompanies);
      });
    });



  }
]);