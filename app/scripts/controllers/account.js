'use strict';

angular.module('cvsApp').controller('AccountCtrl', ['$scope', '$http', 'ENV', function($scope, $http, ENV) {

  $scope.me = {};

  $http.get(ENV.apiEndpoint + '/me')
    .success(function(response) {
      $scope.me = response.user;
    })
    .error(function(response) {
      console.log('ERR', response);
    });

}]);