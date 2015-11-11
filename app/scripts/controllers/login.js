'use strict';

angular.module('cvsApp').controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'AuthService',
  function($rootScope, $scope, $state, AuthService) {

    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.badCredentials = false;

    $scope.login = function() {
      AuthService.login($scope.credentials).then(
        function() {
          AuthService.getUser().then(function() {
            $state.go('account');
          }, function() {
            $state.go('logout');
          });
        }, function() {
          $scope.badCredentials = true;
        }
      );
    };

}]);