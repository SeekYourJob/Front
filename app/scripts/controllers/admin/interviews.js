'use strict';

angular.module('cvsApp').controller('AdminInterviewsCtrl', ['$scope', 'ENV', '$http', '$interval', function($scope, ENV, $http, $interval) {

  $scope.slots = [];
  $scope.locationWithInterviews = {};
  $scope.selectedSlot = {};
  $scope.haveInterviews = false;
  $scope.interviewsWithoutLocation = false;

  $interval(function() {
    if (!$scope.selectedSlot.ido) {
      getLocationsWithInterviewForCurrentSlot();
    }
  }, 60000);

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
      params: {
        sortBy: 'LOCATION'
      }
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
      params: {
        sortBy: 'LOCATION'
      }
    }).then(function(response) {
      $scope.locationWithInterviews = response.data;
      $scope.haveInterviews = true;
    }, function(err) {
      alert('Could not getLocationsWithInterviewForSlot()');
    });
  }

  function getInterviewsWithoutLocation() {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/locations/missing',
    }).then(function(response) {
      $scope.interviewsWithoutLocation = response.data;
    }, function(err) {
      alert('Could not getInterviewsWithoutLocation()');
    });
  }
  getInterviewsWithoutLocation();

  $scope.displayLocationsWithInterviewsForSelectedSlot = function() {
    if (!$scope.selectedSlot) {
      $scope.selectedSlot = {};
      return ;
    }

    getLocationsWithInterviewForSlot($scope.selectedSlot);
  };

  $scope.toggleStatusInterview = function(interview) {
    $http({
      method: 'POST',
      url: ENV.apiEndpoint + '/interviews/' + interview.ido + '/toggle-status',
    }).then(function() {
      if (interview.status === 'IN_PROGRESS') {
        interview.status = 'COMPLETED';
      } else {
        interview.status = 'IN_PROGRESS';
      }
    }, function(err) {
      alert('Could not toggleStatusInterview()');
    });
  }

}]);