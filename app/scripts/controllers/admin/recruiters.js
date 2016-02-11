'use strict';

angular.module('cvsApp').controller('AdminRecruitersCtrl', ['$scope', 'Restangular', '$state', 'ENV', 'AuthService',
  function($scope, Restangular, $state, ENV, AuthService) {

    Restangular.all('recruiters').getList().then(function(recruiters) {
      $scope.recruitersCollection = recruiters;
      $scope.recruitersDisplayedCollection = [].concat($scope.recruitersCollection);
    });

    $scope.$watch('recruitersDisplayedCollection', function(recruiters) {
      if (Array.isArray(recruiters) && recruiters.length === 1) {
        $state.go('app.admin.recruiters.details', {id: recruiters[0].ido});
      }
    });

    $scope.downloadRecruitersSchedules = function() {
      AuthService.getToken().then(function(token) {
        window.location.assign(ENV.apiEndpoint + '/recruiters/download-schedules?token=' + token);
      });
    }
    
  }
]);