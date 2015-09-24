'use strict';

angular.module('cvsApp').service('AuthService', ['$http', '$rootScope', 'jwtHelper', '$q', '$localStorage', 'ENV',
  function($http, $rootScope, jwtHelper, $q, $localStorage, ENV) {

    var self = this;

    self.login = function(credentials) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: ENV.apiEndpoint + '/authenticate',
        skipAuthorization: true,
        data: credentials
      }).success(function(data) {
          $localStorage.token = data.token;
          $rootScope.authenticated = true;
          deferred.resolve(data.token);
      }).error(function() {
        deferred.reject('Bad credentials.');
      });

      return deferred.promise;
    };

    self.getUser = function() {
      var deferred = $q.defer();
      $http.get(ENV.apiEndpoint + '/me')
        .success(function(data) {
          $localStorage.user = data.user;
          $rootScope.user = data.user;
          deferred.resolve(data.user);
        })
        .error(function() {
          deferred.reject('Bugous user.');
        });

      return deferred.promise;
    };

    self.getToken = function() {
      var deferred = $q.defer();

      if ($localStorage.token === null || typeof $localStorage.token === 'undefined') {
        deferred.reject('No token');
      }
      else if (jwtHelper.isTokenExpired($localStorage.token)) {
        console.log('token: needs refresh');
        self.refreshToken().then(function(token) {
          deferred.resolve(token);
        }, function() {
          deferred.reject('Token too old');
        });
      }
      else {
        console.log('token: from storage');
        deferred.resolve($localStorage.token);
      }

      return deferred.promise;
    };

    self.refreshToken = function() {
      console.log('TOKEN EXPIRED, REFRESHING...');
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: ENV.apiEndpoint + '/authenticate/refresh',
        skipAuthorization: true,
        data: {
          oldToken: $localStorage.token
        }
      }).then(function (response) {
        console.log('TOKEN REFRESHED');
        $localStorage.token = response.data.token;
        deferred.resolve(response.data.token);
      }, function () {
        console.log('TOKEN NOT REFRESHED');
        delete $localStorage.token;
        delete $localStorage.user;
        deferred.reject('Token couldnt be renewed');
      });

      return deferred.promise;
    };

    self.check = function() {
      return $localStorage.token;
    };

    self.checkOrganizer = function() {

      var deferred = $q.defer();

      if (typeof $localStorage.token === 'undefined') {
        deferred.reject('No token');
      }

      $http({
        method: 'GET',
        url: ENV.apiEndpoint + '/authenticate/check-organizer'
      }).then(function() {
        console.log('is organizer');
        deferred.resolve();
      }, function() {
        console.log('is NOT organizer');
        deferred.reject('User is not an organizer');
      });

      return deferred.promise;
    };

}]);