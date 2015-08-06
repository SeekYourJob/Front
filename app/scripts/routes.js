'use strict';

angular.module('cvsApp').config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(false);
  $urlRouterProvider.otherwise('/');

  var getAdminTemplate = function(htmlTemplate) {
    return {
      'admin-menu': {templateUrl: 'views/admin/admin-menu.html'},
      'admin-content': {templateUrl: 'views/admin/' + htmlTemplate}
    };
  };

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
      views: {'@': {controller: 'AccountCtrl', templateUrl: 'views/account.html'}}
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
      abstract: true,
      url: '/admin',
      views: {
        '@': {templateUrl: 'views/admin/admin.html'}
      },
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
    })
    .state('admin.home', {
      url: '/',
      views: getAdminTemplate('home.html')
    })
    .state('admin.users', {
      url: '/users',
      views: getAdminTemplate('users.html')
    })
    .state('admin.companies', {
      url: '/companies',
      views: getAdminTemplate('companies.html')
    })

  ;

});