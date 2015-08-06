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
          AuthService.getUser().then(function() {
            console.log('we got the user, we can go to account!');
            $state.go('account');
          }, function() {
            console.log('error while getting user...');
          });
        }, function() {
          console.log('error while authenticating');
        }
      );
    };

}]);