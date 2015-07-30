'use strict';

angular.module('cvsApp').config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('session', {
      resolve: {
        authentication: ['AuthService', '$q', function (AuthService, $q) {
          // The authentication fails if no Token exists
          if (!AuthService.check()) {
            return $q.reject({
              notAuthenticated: true
            });
          }
        }]
      }
    })
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
      parent: 'session',
      url: '/account',
      views: {'@': {
          controller: 'AccountCtrl', templateUrl: 'views/account.html'
        }
      }
    })
    .state('registerCandidate', {
      url: '/register-candidate',
      controller: 'RegisterCandidateCtrl',
      templateUrl: 'views/register-candidate.html'
    });

});