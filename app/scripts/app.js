'use strict';

var cvsApp = angular.module('cvsApp', ['ui.router', 'angular-jwt']);

cvsApp.constant('constants', {
  urlAPI: 'http://api.cvs.dev'
});




cvsApp.config(function Config($httpProvider, jwtInterceptorProvider) {

  jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http, config, constants) {

    var token = localStorage.getItem('token');

    // Skip authentication for any requests ending in .html
    if (config.url.substr(config.url.length - 5) === '.html') {
      return null;
    }

    if (token === null) {
      return;
    }

    else if (jwtHelper.isTokenExpired(token)) {
      console.log('EXPIRED TOKEN, NEEDS REFRESH');

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
        console.log('ERROR WHILE REFRESHING TOKEN');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      });
    }

    else {
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