'use strict';

angular.module('cvsApp').controller('AdminCtrl', ['$scope', 'Restangular',
  function($scope, Restangular) {

    $scope.slots = false;
    $scope.interviewsByCompanies = false;
    $scope.selectedInterview = false;

    $scope.popover = {templateUrl: 'popover.html'};

    Restangular.all('interviews/slots').getList().then(function(slots) {
      $scope.slots = slots.plain();

      Restangular.all('interviews').getList().then(function(interviewsByCompanies) {
        $scope.interviewsByCompanies = interviewsByCompanies.plain();
      });
    });

    $scope.setSelectedInterview = function(interview) {
      $scope.selectedInterview = interview;
    };

  }
]);