'use strict';

angular.module('cvsApp').controller('AdminInterviewsCtrl', ['$scope', 'ENV', '$http', function($scope, ENV, $http) {

  $scope.slots = [];
  $scope.locationWithInterviews = {};
  $scope.selectedSlot = {};

  function getAllSlots() {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/interviews/slots'
    }).then(function(response) {
      $scope.slots = response.data;
    }, function(err) {
      console.log(err);
    })
  }
  getAllSlots();

  function getLocationsWithInterviewForSlot(slot) {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/locations/interviews-for-slot/' + slot.ido,
    }).then(function(response) {
      $scope.locationWithInterviews = response.data;
      console.log($scope.locationWithInterviews);
    }, function(err) {
      //TODO
    })
  }

  $scope.displayLocationsWithInterviewsForSelectedSlot = function() {
    if (!$scope.selectedSlot) {
      return ;
    }

    getLocationsWithInterviewForSlot($scope.selectedSlot);
  };

}]);