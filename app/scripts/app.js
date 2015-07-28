'use strict';

var cvsApp = angular.module('cvsApp', ['ui.router', 'satellizer']);

cvsApp.config(function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider) {
  $authProvider.loginUrl = 'http://cvs.dev:80/api/authenticate';

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
    .state('registerCandidate', {
      url: '/register-candidate',
      controller: 'RegisterCandidateCtrl',
      templateUrl: 'views/register-candidate.html'
    });
});
