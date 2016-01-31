'use strict';

angular.module('cvsApp').controller('AdminInterviewsCtrl', ['$scope', 'ENV', '$http', function($scope, ENV, $http) {

  $scope.slots = [];
  $scope.locationWithInterviews = {};
  $scope.selectedSlot = {};
  $scope.haveInterviews = false;

  function getAllSlots() {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/interviews/slots'
    }).then(function(response) {
      $scope.slots = response.data;
    }, function(err) {
      //FIXME
    })
  }
  getAllSlots();

  function getLocationsWithInterviewForCurrentSlot() {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/locations/interviews-for-current-slot/',
    }).then(function(response) {
      $scope.locationWithInterviews = response.data;
      $scope.haveInterviews = true;
    })
  }
  getLocationsWithInterviewForCurrentSlot();

  function getLocationsWithInterviewForSlot(slot) {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/locations/interviews-for-slot/' + slot.ido,
    }).then(function(response) {
      $scope.locationWithInterviews = response.data;
      $scope.haveInterviews = true;
    }, function(err) {
      alert('Could not getLocationsWithInterviewForSlot()');
    })
  }

  $scope.displayLocationsWithInterviewsForSelectedSlot = function() {
    if (!$scope.selectedSlot) {
      return ;
    }

    getLocationsWithInterviewForSlot($scope.selectedSlot);
  };

}]);