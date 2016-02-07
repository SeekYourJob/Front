angular.module('cvsApp').controller('AdminLiveCtrl', ['$scope', '$http', 'ENV', '$interval', '$rootScope', 'selectedSlot', function($scope, $http, ENV, $interval, $rootScope, selectedSlot) {

  $scope.now = new Date();
  $scope.apiInterviews = [];

  var pusherChannel = $rootScope.pusherClient.subscribe('live-interviews');

  pusherChannel.bind('interviews-updated', function() {
    updateLive();
  });

  function clock() {
    $interval(function() {
      $scope.now = new Date();
    }, 60000);
  }
  clock();

  function updateLive() {
    if (selectedSlot) {
      getLocationsWithInterviewForSlot(selectedSlot)
    } else {
      getLocationsWithInterviewForCurrentSlot();
    }
  }
  updateLive();

  function updateLocationsOnInterval() {
    $interval(function() {
      if (!selectedSlot) {
        getLocationsWithInterviewForCurrentSlot();
      }
    }, 30000);
  }
  updateLocationsOnInterval();

  function getLocationsWithInterviewForCurrentSlot() {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/locations/interviews-for-current-slot/',
      params: {
        sortBy: 'COMPANY'
      }
    }).then(function(response) {
      $scope.apiInterviews = response.data;
    });
  }

  function getLocationsWithInterviewForSlot(slot) {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/locations/interviews-for-slot/' + slot,
      params: {
        sortBy: 'COMPANY'
      }
    }).then(function(response) {
      $scope.apiInterviews = response.data;
    });
  }

}]);