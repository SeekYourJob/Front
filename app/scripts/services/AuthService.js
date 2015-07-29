'use strict';

angular.module('cvsApp').service('AuthService', ['$auth', '$http', '$rootScope', '$state', 'constants',
  function($auth, $http, $rootScope, $state, constants) {

    this.login = function(credentials) {
      $auth.login(credentials, '/account').then(function() {
        return $http.get(constants.urlAPI + '/me');
      }, function(error) {
        console.log(error);
      }).then(function(response) {
        if (typeof response !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          $rootScope.authenticated = true;
          $rootScope.user = response.data.user;
        }
      });
    };

    this.check = function() {
      return $auth.isAuthenticated();
    };

    this.needsAccess = function() {
      if (!$auth.isAuthenticated()) {
        $state.go('login');
        return;
      }
    };

}]);