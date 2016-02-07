'use strict';

angular.module('cvsApp').controller('AdminCtrl', ['$scope', 'Restangular', '$pusher', '$rootScope',
  function($scope, Restangular, $pusher, $rootScope, $http) {

    var pusher = $pusher($rootScope.pusherClient);
    var pusherChannel = pusher.subscribe('presence-interviews');

    $scope.slots = false;
    $scope.interviewsByCompanies = false;
    $scope.selectedInterview = false;
    $scope.stats = false;

    $scope.pusherChannelMembers = pusherChannel.members;

    function getInterviews() {
      Restangular.all('interviews').getList().then(function(interviewsByCompanies) {
        $scope.interviewsByCompanies = interviewsByCompanies.plain();
      });
    }

    function getStats() {
      Restangular.one('stats/interviews').get().then(function(res) {
        $scope.stats = res.plain();
      });
    }
    getStats();

    Restangular.all('interviews/slots').getList().then(function(slots) {
      $scope.slots = slots.plain();
      getInterviews();
    });

    $scope.setSelectedInterview = function(interview) {
      $scope.selectedInterview = interview;
    };

    pusherChannel.bind('interviews-updated',
      function(data) {
        getInterviews();
      }
    );

  }
]);