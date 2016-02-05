angular.module('cvsApp').controller('AdminLiveCtrl', ['$scope', '$http', 'ENV', '$interval', '$rootScope', function($scope, $http, ENV, $interval, $rootScope) {

  $scope.now = new Date();
  $scope.apiInterviews = [];

  var pusherChannel = $rootScope.pusherClient.subscribe('live-interviews');

  function clock() {
    $interval(function() {
      $scope.now = new Date();
    }, 60000);
  }
  clock();

  function updateLocationsOnInterval() {
    $interval(function() {
      getLocationsWithInterviewForCurrentSlot();
    }, 20000);
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
  getLocationsWithInterviewForCurrentSlot();

  pusherChannel.bind('interviews-updated', function() {
    getLocationsWithInterviewForCurrentSlot();
  });

}]);