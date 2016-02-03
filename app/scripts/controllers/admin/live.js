angular.module('cvsApp').controller('AdminLiveCtrl', ['$scope', '$http', 'ENV', '$interval', function($scope, $http, ENV, $interval) {

  $scope.now = new Date();
  $scope.apiInterviews = [];

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
    }).then(function(response) {
      $scope.apiInterviews = response.data;
    });
  }
  getLocationsWithInterviewForCurrentSlot();

}]);