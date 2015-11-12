'use strict';

angular.module('cvsApp').controller('AccountRecruiterCtrl',
  ['$scope','Upload','ENV','Restangular','UploadService',
    function($scope,Upload,ENV, Restangular, UploadService) {

      $scope.user = $scope.$parent.user;
      $scope.accountPopover = {templateUrl: 'popover.html'};

      $scope.documents = [];

      $scope.form = {
        documents: false,
        documentIsBeingSent: false
      };

      $scope.setSelectedAccountInterview = function(interview) {
        $scope.selectedAccountInterview = interview;
      };

      $scope.$watch('form.documents', function() {
        $scope.uploadDocuments($scope.form.documents);
      });

      // Documents
      $scope.uploadDocuments = function(files) {
        $scope.form.documentIsBeingSent = true;
        console.log(files);
        UploadService.upload($scope.user,files,$scope.documents);
        $scope.form.documentIsBeingSent = false;
      };

      Restangular.one('documents/user',$scope.user.ido).get().then(function(documents) {
        $scope.documents = documents.plain();
      });

      $scope.deleteDocument = function(document) {
        Restangular.one("documents", document.ido).remove().then(function() {
          $scope.documents.splice($scope.documents.indexOf(document), 1);
        });
      };

      $scope.downloadDocument = function(document) {
        Restangular.one("documents/request-token", document.ido).get().then(function(download) {
          window.open(ENV.apiEndpoint + '/documents/' + download.plain().token);
        });
      };

    }

  ]
);