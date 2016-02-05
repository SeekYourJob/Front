'use strict';

angular.module('cvsApp').controller('AdminRecruitersCtrl', ['$scope', 'Restangular', '$state',
  function($scope, Restangular, $state) {

    Restangular.all('recruiters').getList().then(function(recruiters) {
      $scope.recruitersCollection = recruiters;
      $scope.recruitersDisplayedCollection = [].concat($scope.recruitersCollection);
    });

    $scope.$watch('recruitersDisplayedCollection', function(recruiters) {
      if (Array.isArray(recruiters) && recruiters.length === 1) {
        $state.go('app.admin.recruiters.details', {id: recruiters[0].ido});
      }
    });

  }
]);