'use strict';

angular.module('cvsApp').service('AuthService', ['$http', '$rootScope', 'jwtHelper', '$q', '$localStorage', 'ENV', function($http, $rootScope, jwtHelper, $q, $localStorage, ENV) {

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

  self.logout = function() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: ENV.apiEndpoint + '/logout'
    }).success(function() {
      delete $localStorage.token;
      delete $localStorage.user;
      delete $rootScope.user;
      $rootScope.authenticated = false;
      deferred.resolve();
    }).error(function() {
      deferred.reject('Error while logging out');
    });

    return deferred.promise;
  };

  self.askPasswordReset = function(email) {
    return $http({
      method: 'POST',
      url: ENV.apiEndpoint + '/authenticate/ask-reset-password',
      skipAuthorization: true,
      data: {email: email}
    });
  };

  self.doPasswordReset = function(resetParameters) {
    return $http({
      method: 'POST',
      url: ENV.apiEndpoint + '/authenticate/do-reset-password',
      skipAuthorization: true,
      data: resetParameters
    });
  };

  self.getUser = function($showDetails) {
    var url = ENV.apiEndpoint + '/me/';
    if ($showDetails === true) {
      url += '?showDetails=true';
    }
    var deferred = $q.defer();
    $http.get(url)
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
      console.log('[TOKEN] : Refresh needed');
      self.refreshToken().then(function(token) {
        deferred.resolve(token);
      }, function() {
        deferred.reject('[TOKEN] : Too old');
      });
    }
    else {
      console.log('[TOKEN] : Fetched from Storage');
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
      console.log('[ACCESS] : Organizer');
      deferred.resolve();
    }, function() {
      console.log('[ACCESS] : User');
      deferred.reject('User is not an organizer');
    });

    return deferred.promise;
  };

}]);