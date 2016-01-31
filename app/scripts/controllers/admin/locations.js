'use strict';

angular.module('cvsApp').controller('AdminLocationsCtrl', ['$scope', 'ENV', '$http', function($scope, ENV, $http) {

  $scope.interviewsWithoutLocation = false;
  $scope.bookings = false;

  function getInterviewsWithoutLocation() {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/locations/missing',
    }).then(function(response) {
      $scope.interviewsWithoutLocation = response.data;
    }, function(err) {
      alert('Could not getInterviewsWithoutLocation()');
    })
  }
  getInterviewsWithoutLocation();

  function getBookings() {
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/locations/bookings',
    }).then(function(response) {
      $scope.bookings = response.data;
      console.log($scope.bookings);
    }, function(err) {
      alert('Could not getBookings()');
    })
  }
  getBookings();

}]);