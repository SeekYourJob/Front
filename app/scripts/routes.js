'use strict';

angular.module('cvsApp').config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  //$locationProvider.html5Mode(false);
  $locationProvider.html5Mode(true);

  $urlRouterProvider.when('','/');
  $urlRouterProvider.otherwise('/');

  $stateProvider

    .state('app', {
      url: '',
      views: {
        'header': {
          templateUrl: 'views/skeleton/header.html'
        },
        'footer': {
          templateUrl: 'views/skeleton/footer.html'
        }
      }
    })

    .state('app.session', {
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

    .state('app.home', {
      url: '/',
      views: {'content@': {templateUrl: 'views/home.html',
        controller: ['AuthService', '$state', function(AuthService, $state) {
        if (AuthService.check()) {
          $state.go('app.account');
        }
      }]}}
    })
    .state('app.login', {
      url: '/login',
      views: {'content@': {templateUrl: 'views/login.html', controller: 'LoginCtrl'}}
    })
    .state('app.resetPassword', {
      url: '/reset-password',
      views: {'content@': {templateUrl: 'views/reset-password.html', controller: 'LoginCtrl'}}
    })
    .state('app.doResetPassword', {
      url: '/do-reset-password?token',
      views: {'content@': {templateUrl: 'views/do-reset-password.html', controller: 'LoginCtrl'}}
    })
    .state('app.logout', {
      url: '/logout',
      parent: 'app.session',
      views: {
        'content@': {
          template: '',
          controller: ['$state', 'AuthService', function($state, AuthService) {
            AuthService.logout().then(function() {
              $state.go('app.home');
            });
          }]
        }
      }
    })

    .state('app.accessMap', {
      url: '/access-map',
      views: {'content@': {templateUrl: 'views/access-map.html'}}
    })

    .state('app.participatingCompanies', {
      url: '/entreprises-participantes',
      views: {'content@': {templateUrl: 'views/participating-companies.html', controller: ['$scope', 'Restangular', function($scope, Restangular) {
        console.log('okok');
        Restangular.all('companies?short=true').getList().then(function(companies) {
          $scope.companies = companies.plain();
        });
      }]}}
    })

    .state('app.registerRecruiter', {
      url: '/register-recruiter',
      views: {'content@': {templateUrl: 'views/register-recruiter.html', controller: 'RegisterRecruiterCtrl'}}
    })
    .state('app.registerCandidate', {
      url: '/register-candidate',
      views: {'content@': {templateUrl: 'views/register-candidate.html', controller: 'RegisterCandidateCtrl'}}
    })

    .state('app.account', {
      parent: 'app.session',
      url: '/my-account',
      resolve: {
        user: ['AuthService', function(AuthService) {
          return AuthService.getUser(true);
        }]
      },
      views: {
        'content@': {
          templateUrl: 'views/account.html',
          controller: ['$scope', 'user', function($scope, user) {
            $scope.user = user;
          }]
        }
      }
    })



    .state('app.admin', {
      abstract: true,
      parent: 'app.session',
      url: '/admin',
      views: {
        'content@': {templateUrl: 'views/admin/admin.html'},
        'admin-menu@app.admin': {templateUrl: 'views/admin/admin-menu.html'}
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

    .state('app.admin.home', {
      url: '/',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/home.html', controller: 'AdminCtrl'}}
    })
    .state('app.admin.live', {
      url: '/live',
      views: {'@': {templateUrl: 'views/admin/live.html', controller: 'AdminLiveCtrl', resolve: {
        selectedSlot: function() {
          return false;
        }
      }}}
    })
    .state('app.admin.live.forSlot', {
      url: '/{idSlot}',
      views: {'@': {templateUrl: 'views/admin/live.html', controller: 'AdminLiveCtrl', resolve: {
        selectedSlot: ['$stateParams', function($stateParams) {
          return $stateParams.idSlot;
        }]
      }}}
    })
    .state('app.admin.companies', {
      url: '/companies',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/companies.html', controller: 'AdminCompaniesCtrl'}}
    })
    .state('app.admin.companies.details', {
      url: '/{id}',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/companies-details.html', controller: 'AdminCompaniesDetailsCtrl'}}
    })
    .state('app.admin.recruiters', {
      url: '/recruiters',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/recruiters.html', controller: 'AdminRecruitersCtrl'}}
    })
    .state('app.admin.recruiters.details', {
      url: '/{id}',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/recruiters-details.html', controller: 'AdminRecruitersDetailsCtrl'}}
    })
    .state('app.admin.candidates', {
      url: '/candidates',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/candidates.html', controller: 'AdminCandidatesCtrl'}}
    })
    .state('app.admin.candidates.details', {
      url: '/{id}',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/candidates-details.html', controller: 'AdminCandidatesDetailsCtrl'}}
    })
    .state('app.admin.messaging', {
      url: '/messaging',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/messaging.html', controller: 'AdminMessagingCtrl'}}
    })
    .state('app.admin.documents', {
      url: '/documents',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/documents.html', controller: 'AdminDocumentsCtrl'}}
    })
    .state('app.admin.messaging.newEmail', {
      url: '/new-email',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/messaging-newEmail.html', controller: 'AdminMessagingNewEmailCtrl'}}
    })
    .state('app.admin.messaging.predefinedEmail', {
      url: '/predefined-emails',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/messaging-predefinedEmail.html', controller: 'AdminMessagingPredefinedEmailCtrl'}}
    })
    .state('app.admin.messaging.newSMS', {
      url: '/new-sms',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/messaging-newSMS.html', controller: 'AdminMessagingNewSMSCtrl'}}
    })
    .state('app.admin.messaging.predefinedSMS', {
      url: '/predefined-sms',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/messaging-predefinedSMS.html', controller: 'AdminMessagingPredefinedSMSCtrl'}}
    })

    .state('app.admin.interviews', {
      url: '/interviews',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/interviews.html', controller: 'AdminInterviewsCtrl'}}
    })

    .state('app.admin.locations', {
      url: '/locations',
      views: {'admin-content@app.admin': {templateUrl: 'views/admin/locations.html', controller: 'AdminLocationsCtrl'}}
    })

  ;

});