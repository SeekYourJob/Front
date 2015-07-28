'use strict';

var cvsApp = angular.module('cvsApp', ['ui.router']);

cvsApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/home.html'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html'
    });
});
