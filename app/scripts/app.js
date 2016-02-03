'use strict';

var cvsApp = angular.module('cvsApp', ['config', 'ui.router', 'angular-jwt', 'ngFileUpload', 'ui.bootstrap', 'ngStorage', 'smart-table', 'restangular', 'ngSanitize', 'ui.select', 'oitozero.ngSweetAlert', 'pusher-angular']);

cvsApp.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['jwtHelper', '$http', 'config', '$window', '$localStorage', 'AuthService',
    function(jwtHelper, $http, config, $window, $localStorage, AuthService) {
        // Skip authentication for any requests ending in .html
        if (config.url.substr(config.url.length - 5) === '.html') {
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

cvsApp.config(function(RestangularProvider, ENV) {
  RestangularProvider.setBaseUrl(ENV.apiEndpoint);
  RestangularProvider.setRestangularFields({
    id: "ido"
  });
});

cvsApp.config(function(uiSelectConfig) {
  uiSelectConfig.theme = 'bootstrap';
});



cvsApp.run(['$rootScope', '$state', '$localStorage', 'ENV', '$window', 'AuthService', function($rootScope, $state, $localStorage, ENV, $window, AuthService) {

  AuthService.turnOnPusher();

  $rootScope.$on('$stateChangeStart', function(event, toState) {
    if (typeof $localStorage.user !== 'undefined') {
      $rootScope.authenticated = true;
      $rootScope.user = $localStorage.user;

      if (toState.name === 'app.login') {
        event.preventDefault();
        $state.go('app.account');
      }
    }
  });

  $rootScope.$on('$stateChangeError', function (_0, _1, _2, _3, _4, error) {
    if (error.notAuthenticated) {
      $state.go('app.login');
    } else if (error.accessDenied) {
      $state.go('app.home');
    }
  });

  $rootScope.$on('$stateChangeSuccess', function() {
    $window.scrollTo(0, 0);
  });

}]);