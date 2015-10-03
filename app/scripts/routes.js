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
    .state('logout', {
      url: '/logout',
      controller: 'LogoutCtrl'
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
        '@': {templateUrl: 'views/admin/admin.html'},
        'admin-menu@admin': {templateUrl: 'views/admin/admin-menu.html'}
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
      views: {'admin-content@admin': {templateUrl: 'views/admin/home.html', controller: 'AdminCtrl'}}
    })
    .state('admin.companies', {
      url: '/companies',
      views: {'admin-content@admin': {templateUrl: 'views/admin/companies.html', controller: 'CompaniesCtrl'}}
    })
    .state('admin.companies.details', {
      url: '/{id:int}',
      views: {'admin-content@admin': {templateUrl: 'views/admin/companies-details.html', controller: 'CompaniesDetailsCtrl'}}
    })
    .state('admin.recruiters', {
      url: '/recruiters',
      views: {'admin-content@admin': {templateUrl: 'views/admin/recruiters.html', controller: 'RecruitersCtrl'}}
    })
    .state('admin.recruiters.details', {
      url: '/{id:int}',
      views: {'admin-content@admin': {templateUrl: 'views/admin/recruiters-details.html', controller: 'RecruitersDetailsCtrl'}}
    })

  ;

});