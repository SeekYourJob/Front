'use strict';

angular.module('cvsApp').controller('RegisterCandidateCtrl',  ['$scope', '$http', 'Upload', 'AuthService', '$state', 'ENV', 'UploadService',
  function($scope, $http, Upload, AuthService, $state, ENV, UploadService) {

    $scope.newCandidate = {
      user: {},
      candidate: {
        grade: '',
        documents: []
      }
    };

    $scope.grades = ['L3','M1','M2','ISEN'];
    $scope.newCandidate.candidate.grade = $scope.grades[0];

    $scope.form = {
      others: '',
      documents: false,
      emailAlreadyExists: false,
      documentIsBeingSent: false,
      isBeingSubmitted: false,
      isSubmitted: false
    };

    $scope.$watch('form.documents', function() {
      $scope.uploadDocuments($scope.form.documents);
    });

    $scope.checkDuplicateEmail = function() {
      $http({method: 'GET', url: ENV.apiEndpoint + '/authenticate/check-email', skipAuthorization: true,
        params: {
          email: $scope.newCandidate.user.email
        }
      }).then(function() {
        $scope.form.emailAlreadyExists = false;
      }, function() {
        $scope.form.emailAlreadyExists = true;
        $scope.credentialPartForm.email.$setValidity("required", false);
      });
    };

    $scope.uploadDocuments = function(files) {
      $scope.form.documentIsBeingSent = true;
      UploadService.upload(null,files,$scope.newCandidate.candidate.documents);
      $scope.form.documentIsBeingSent = false;
    };

    $scope.deleteDocument = function(document) {
      $scope.newCandidate.candidate.documents.splice($scope.newCandidate.candidate.documents.indexOf(document), 1);
    };

    $scope.register = function() {
      $scope.form.isBeingSubmitted = true;
      $http({method: 'POST', url: ENV.apiEndpoint + '/authenticate/register-candidate',
        skipAuthorization: true,
        data: $scope.newCandidate
      }).then(function() {
        $scope.form.isSubmitted = true;
        AuthService.login({
          email: $scope.newCandidate.user.email,
          password: $scope.newCandidate.user.password
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

    $scope.formsAreValid = function() {
      return ($scope.credentialPartForm.$valid &&
      $scope.contactInfoPartForm.$valid);
    };

}]);