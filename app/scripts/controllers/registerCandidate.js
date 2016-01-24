'use strict';

angular.module('cvsApp').controller('RegisterCandidateCtrl',  ['$scope', '$http', 'Upload', 'AuthService', '$state', 'ENV', 'UploadService',
  function($scope, $http, Upload, AuthService, $state, ENV, UploadService) {

    $scope.grades = ['L3','M1','M2'];

    $scope.newCandidate = {
      user: {},
      candidate: {
        availability: '',
        grade: '',
        documents: []
      }
    };



  $scope.init();

}]);