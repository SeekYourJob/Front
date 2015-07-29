'use strict';

var cvsApp = angular.module('cvsApp', ['ui.router', 'satellizer']);

cvsApp.constant('constants', {
  urlAPI: 'http://api.cvs.dev'
});

cvsApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider, constants) {
  $authProvider.loginUrl = constants.urlAPI + '/authenticate';

  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html'
    })
    .state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: 'views/login.html'
    })
    .state('account', {
      url: '/account',
      controller: 'AccountCtrl',
      templateUrl: 'views/account.html'
    })
    .state('registerCandidate', {
      url: '/register-candidate',
      controller: 'RegisterCandidateCtrl',
      templateUrl: 'views/register-candidate.html'
    });
});

cvsApp.run(function($rootScope, $state) {
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
});