'use strict';

angular.module('cvsApp').controller('LoginCtrl', ['$rootScope', '$scope', '$auth', '$state', '$http', 'constants', function($rootScope, $scope, $auth, $state, $http, constants) {

  $scope.credentials = {
    email: '',
    password: ''
  };

  $scope.login = function() {
    $auth.login($scope.credentials, '/account').then(function() {
      return $http.get(constants.urlAPI + '/me');
    }, function(error) {
      console.log(error);
    }).then(function(response) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      $rootScope.authenticated = true;
      $rootScope.user = response.data.user;

      //$state.go('account');
    });
  };

}]);