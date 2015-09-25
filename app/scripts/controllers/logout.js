'use strict';

angular.module('cvsApp').controller('LogoutCtrl', ['$rootScope', '$scope', '$state', 'AuthService',
  function($rootScope, $scope, $state, AuthService) {

    AuthService.logout().then(function() {
      console.log('has been logged out!');
      $state.go('home');
    });

  }]);