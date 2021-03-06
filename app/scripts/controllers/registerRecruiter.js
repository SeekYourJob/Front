'use strict';

angular.module('cvsApp').controller('RegisterRecruiterCtrl', ['$scope', '$http', 'Upload', 'AuthService', '$state', 'ENV', 'UploadService', function($scope, $http, Upload, AuthService, $state, ENV, UploadService) {

  $scope.companies = [];
  $scope.newRecruiter = {
    user: {},
    recruiter: {
      availability: '',
      company: {
        name: '',
        jobTypes: {Stage: true, Alternance: false, Emploi: false}
      },
      documents: []
    },
    participantsEmails: [],
    participantsData: []
  };
  $scope.form = {
    others: '',
    emailRecruiterToAdd: '',
    dataRecruiterToAdd: {},
    documents: false,
    emailAlreadyExists: false,
    documentIsBeingSent: false,
    isBeingSubmitted: false,
    isSubmitted: false
  };

  $scope.getCompanies = function() {
    $http({
      method: 'GET', url: ENV.apiEndpoint + '/companies', skipAuthorization: true,
      params: {
        short: true
      }
    }).then(function(response) {
      if (typeof response.data !== 'undefined') {
        for (var index = 0; index < response.data.length; index++) {
          $scope.companies.push(response.data[index].name);
        }
      }
    });
  };
  $scope.getCompanies();

  $scope.$watch('form.documents', function() {
    $scope.uploadDocuments($scope.form.documents);
  });

  $scope.$watch('form.others', function() {
    $scope.newRecruiter.participantsEmails = [];
    $scope.newRecruiter.participantsData = [];
  });

  $scope.checkDuplicateEmail = function() {
    $http({method: 'GET', url: ENV.apiEndpoint + '/authenticate/check-email', skipAuthorization: true,
      params: {
        email: $scope.newRecruiter.user.email
      }
    }).then(function() {
      $scope.form.emailAlreadyExists = false;
    }, function() {
      $scope.form.emailAlreadyExists = true;
      $scope.credentialPartForm.email.$setValidity("required", false);
    });
  };

  $scope.addRecruiterEmail = function() {
    if (typeof $scope.form.emailRecruiterToAdd !== 'undefined') {
      $scope.newRecruiter.participantsEmails.push($scope.form.emailRecruiterToAdd);
      $scope.form.emailRecruiterToAdd = '';
    }
  };

  $scope.deleteRecruiterEmail = function(email) {
    $scope.newRecruiter.participantsEmails.splice($scope.newRecruiter.participantsEmails.indexOf(email), 1);
  };

  $scope.addRecruiterData = function() {
    var toValidate = $scope.form.dataRecruiterToAdd;
    if (toValidate.firstname !== '' && toValidate.lastname !== '' && toValidate.email !== '') {
      $scope.newRecruiter.participantsData.push($scope.form.dataRecruiterToAdd);
      $scope.resetDataRecruiterToAdd();
    }
  };

  $scope.deleteRecruiterData = function(data) {
    $scope.newRecruiter.participantsData.splice($scope.newRecruiter.participantsData.indexOf(data), 1);
  };

  $scope.resetDataRecruiterToAdd = function() {
    $scope.form.dataRecruiterToAdd = {
      firstname: '',
      lastname: '',
      email: '',
      availability: 'all',
      parkingOption: false,
      lunchOption: false
    };
  };

  $scope.resetDataRecruiterToAdd();

  $scope.uploadDocuments = function(files) {
    $scope.form.documentIsBeingSent = true;
    UploadService.upload(null,files,$scope.newRecruiter.recruiter.documents);
    $scope.form.documentIsBeingSent = false;
  };

  $scope.deleteDocument = function(document) {
    $scope.newRecruiter.recruiter.documents.splice($scope.newRecruiter.recruiter.documents.indexOf(document), 1);
  };

  $scope.register = function() {
    $scope.form.isBeingSubmitted = true;
    $http({method: 'POST', url: ENV.apiEndpoint + '/authenticate/register-recruiter',
      skipAuthorization: true,
      data: $scope.newRecruiter
    }).then(function() {
      $scope.form.isSubmitted = true;
      AuthService.login({
        email: $scope.newRecruiter.user.email,
        password: $scope.newRecruiter.user.password
      }).then(function() {
        AuthService.getUser().then(function() {
          $state.go('app.account');
        }, function() {
          //TODO Error while getting user on login
        });
      });
    }, function() {
      $scope.form.isSubmitted = false;
    });
  };

  $scope.collaboratorsFormIsValid = function() {
    return $scope.othersPartForm.$valid && ($scope.form.others === 'none' || ($scope.form.others === 'withEmails' && $scope.newRecruiter.participantsEmails.length) || ($scope.form.others === 'withData' && $scope.newRecruiter.participantsData.length));
  };

  $scope.formsAreValid = function() {
    return ($scope.credentialPartForm.$valid &&
      $scope.contactInfoPartForm.$valid &&
      $scope.availabilityPartForm.$valid &&
      $scope.collaboratorsFormIsValid());
  };

}]);