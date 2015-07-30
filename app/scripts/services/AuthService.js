'use strict';

angular.module('cvsApp').service('AuthService', ['$http', '$rootScope', 'jwtHelper', '$q', '$window', 'constants',
  function($http, $rootScope, jwtHelper, $q, $window, constants) {

    var self = this;

    self.login = function(credentials) {
      console.log('AuthService.login');

      return $http({
        method: 'POST',
        url: constants.urlAPI + '/authenticate',
        skipAuthorization: true,
        data: credentials
      }).success(function(data) {
          localStorage.setItem('token', data.token);
          $rootScope.authenticated = true;
          return self.getUser();
        }).error(function() {
          return false;
        });

    };

    self.getUser = function() {
      return $http.get(constants.urlAPI + '/me').
        success(function(data) {
          localStorage.setItem('user', JSON.stringify(data.user));
          $rootScope.user = data.user;
          return data.user;
        }).
        error(function() {
          return false;
        });
    };

    self.check = function() {
      return localStorage.getItem('token');
    };

}]);