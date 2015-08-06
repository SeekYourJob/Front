'use strict';

angular.module('cvsApp').config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('session', {
      resolve: {
        authentication: ['AuthService', '$q', function (AuthService, $q) {
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
      views: {'@': {controller: 'AccountCtrl', templateUrl: 'views/account.html'}
      }
    })
    .state('registerRecruiter', {
      url: '/register-recruiter',
      controller: 'RegisterRecruiterCtrl',
      templateUrl: 'views/register-recruiter.html'
    })
    .state('registerCandidate', {
      url: '/register-candidate',
      controller: 'RegisterCandidateCtrl',
      templateUrl: 'views/register-candidate.html'
    })
    .state('admin', {
      url: '/admin',
      controller: 'AdminCtrl',
      templateUrl: 'views/admin.html',
      resolve: {
        organizer: ['AuthService', '$q', function (AuthService, $q) {
          return AuthService.checkOrganizer().then(function() {
            // User is organizer, nothing to do...
          }, function() {
            return $q.reject({
              accessDenied: true
            });
          });
        }]
      }
    });

});