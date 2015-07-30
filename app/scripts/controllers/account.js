'use strict';

angular.module('cvsApp').controller('AccountCtrl', ['$scope', '$http', 'constants', function($scope, $http, constants) {

  $scope.me = {};

  $http.get(constants.urlAPI + '/me')
    .success(function(response) {
      $scope.me = response.user;
    })
    .error(function(response) {
      console.log('ERR', response);
    });

}]);