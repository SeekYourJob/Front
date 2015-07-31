'use strict';

angular.module('cvsApp').controller('RegisterRecruiterCtrl', ['$scope', '$http', 'constants', function($scope, $http, constants) {

  $scope.newRecruiter = {
    user: {},
    recruiter: {
      availability: ''
    },
    recruitersEmails: [],
    recruitersData: []
  };

  $scope.form = {
    others: '',
    emailRecruiterToAdd: '',
    dataRecruiterToAdd: {}
  };

  $scope.checkDuplicateEmail = function() {
    console.log('we need to check the email duplicate1');
    $http({method: 'GET', url: constants.urlAPI + '/authenticate/check-email', skipAuthorization: true,
      params: {
        email: $scope.newRecruiter.user.email
      }
    }).then(function() {
      console.log('not exists');
    }, function() {
      console.log('exists');
    });
  };

  $scope.addRecruiterEmail = function() {
    if (typeof $scope.form.emailRecruiterToAdd !== 'undefined') {
      $scope.newRecruiter.recruitersEmails.push($scope.form.emailRecruiterToAdd);
      $scope.form.emailRecruiterToAdd = '';
    }
  };

  $scope.deleteRecruiterEmail = function(email) {
    $scope.newRecruiter.recruitersEmails.splice($scope.newRecruiter.recruitersEmails.indexOf(email), 1);
  };

  $scope.addRecruiterData = function() {
    var toValidate = $scope.form.dataRecruiterToAdd;
    if (toValidate.firstname !== '' && toValidate.lastname !== '' && toValidate.email !== '') {
      $scope.newRecruiter.recruitersData.push($scope.form.dataRecruiterToAdd);
      $scope.resetDataRecruiterToAdd();
    }
  };

  $scope.deleteRecruiterData = function(data) {
    $scope.newRecruiter.recruitersData.splice($scope.newRecruiter.recruitersData.indexOf(data), 1);
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

  $scope.register = function() {
    console.log('we need to register this new recruiter!');
    $http({method: 'POST', url: constants.urlAPI + '/authenticate/register-recruiter',
      skipAuthorization: true,
      data: $scope.newRecruiter
    }).then(function(response) {
      console.log('SUCCESS', response);
    }, function() {
      console.log('ERROR');
    });
  };

}]);