'use strict';

var cvsApp = angular.module('cvsApp', ['ui.router', 'angular-jwt', 'ngFileUpload', 'ui.bootstrap', 'ngStorage']);

cvsApp.constant('constants', {
  urlAPI: 'http://api.cvs.dev'
});




cvsApp.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['jwtHelper', '$http', 'config', '$window', '$localStorage', 'AuthService',
    function(jwtHelper, $http, config, $window, $localStorage, AuthService) {

        // Skip authentication for any requests ending in .html
        if (config.url.substr(config.url.length - 5) === '.html') {
          console.log('token: html');
          return null;
        }

        return AuthService.getToken().then(function(token) {
          return token;
        }, function() {
          return null;
        });

    }
  ];

  $httpProvider.interceptors.push('jwtInterceptor');
});




cvsApp.run(['$rootScope', '$state', '$localStorage', function($rootScope, $state, $localStorage) {
  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (typeof $localStorage.user !== 'undefined') {
      $rootScope.authenticated = true;
      $rootScope.user = $localStorage.user;

      if (toState.name === 'login') {
        event.preventDefault();
        $state.go('account');
      }
    }
  });

  $rootScope.$on('$stateChangeError', function (_0, _1, _2, _3, _4, error) {
    console.log(error);
    if (error.notAuthenticated) {
      $state.go('login');
    }
    else if (error.accessDenied) {
      $state.go('home');
    }
  });
}]);