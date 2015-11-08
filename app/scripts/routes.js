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
      url: '/my-account',
      resolve: {
        user: ['AuthService', function(AuthService) {
          return AuthService.getUser(true);
        }]
      },
      views: {'@': {
        templateUrl: 'views/account.html',
        controller: ['$scope', 'user', function($scope, user) {
          $scope.user = user;
        }]
      }}
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
      views: {'admin-content@admin': {templateUrl: 'views/admin/companies.html', controller: 'AdminCompaniesCtrl'}}
    })
    .state('admin.companies.details', {
      url: '/{id}',
      views: {'admin-content@admin': {templateUrl: 'views/admin/companies-details.html', controller: 'AdminCompaniesDetailsCtrl'}}
    })
    .state('admin.recruiters', {
      url: '/recruiters',
      views: {'admin-content@admin': {templateUrl: 'views/admin/recruiters.html', controller: 'AdminRecruitersCtrl'}}
    })
    .state('admin.recruiters.details', {
      url: '/{id}',
      views: {'admin-content@admin': {templateUrl: 'views/admin/recruiters-details.html', controller: 'AdminRecruitersDetailsCtrl'}}
    })
    .state('admin.messaging', {
      url: '/messaging',
      views: {'admin-content@admin': {templateUrl: 'views/admin/messaging.html', controller: 'AdminMessagingCtrl'}}
    })
    .state('admin.messaging.newEmail', {
      url: '/new-email',
      views: {'admin-content@admin': {templateUrl: 'views/admin/messaging-newEmail.html', controller: 'AdminMessagingNewEmailCtrl'}}
    })
    .state('admin.messaging.predefinedEmail', {
      url: '/predefined-emails',
      views: {'admin-content@admin': {templateUrl: 'views/admin/messaging-predefinedEmail.html', controller: 'AdminMessagingPredefinedEmailCtrl'}}
    })
    .state('admin.messaging.newSMS', {
      url: '/new-sms',
      views: {'admin-content@admin': {templateUrl: 'views/admin/messaging-newSMS.html', controller: 'AdminMessagingNewSMSCtrl'}}
    })
    .state('admin.messaging.predefinedSMS', {
      url: '/predefined-sms',
      views: {'admin-content@admin': {templateUrl: 'views/admin/messaging-predefinedSMS.html', controller: 'AdminMessagingPredefinedSMSCtrl'}}
    })

  ;

});