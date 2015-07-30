'use strict';

angular.module('cvsApp').controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'AuthService',
  function($rootScope, $scope, $state, AuthService) {

    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.login = function() {
      AuthService.login($scope.credentials).then(
        function(success) {
          console.log('SUCCESS !!!', success);
          $state.go('account');
        },
        function(error) {
          console.log('ERROR !!!', error);
        }
      );
    };

}]);