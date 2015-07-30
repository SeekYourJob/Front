'use strict';

var cvsApp = angular.module('cvsApp', ['ui.router', 'angular-jwt']);

cvsApp.constant('constants', {
  urlAPI: 'http://api.cvs.dev'
});




cvsApp.config(function Config($httpProvider, jwtInterceptorProvider) {

  jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http, config, $window, constants) {

    var token = localStorage.getItem('token');

    // Skip authentication for any requests ending in .html
    if (config.url.substr(config.url.length - 5) === '.html') {
      return null;
    }

    if (token === null) {
      return;
    }

    else if (jwtHelper.isTokenExpired(token)) {
      console.log('TOKEN EXPIRED, REFRESHING...');

      return $http({
        method: 'POST',
        url: constants.urlAPI + '/authenticate/refresh',
        skipAuthorization: true,
        data: {
          oldToken: token
        }
      }).then(function (response) {
        console.log('TOKEN REFRESHED');
        localStorage.setItem('token', response.data.token);
        return response.data.token;
      }, function () {
        console.log('TOKEN NOT REFRESHED, RELOADING');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        $window.location.reload();
      });
    }

    else {
      console.log('TOKEN AVAILABLE, USING');
      return token;
    }

  };

  $httpProvider.interceptors.push('jwtInterceptor');
});




cvsApp.run(['$rootScope', '$state', 'AuthService', function($rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    var user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      $rootScope.authenticated = true;
      $rootScope.user = user;

      if (toState.name === 'login') {
        event.preventDefault();
        $state.go('account');
      }
    }
  });

  $rootScope.$on('$stateChangeError', function (_0, _1, _2, _3, _4, error) {
    if (error.notAuthenticated) {
      $state.go('login');
    }
  });
}]);