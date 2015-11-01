'use strict';

angular.module('cvsApp').controller('AccountRecruiterCtrl',
  ['$scope','Upload','ENV',
    function($scope,Upload,ENV) {

      $scope.user = $scope.$parent.user;
      $scope.accountPopover = {templateUrl: 'popover.html'};

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

      $scope.setSelectedAccountInterview = function(interview) {
        $scope.selectedAccountInterview = interview;
      };

      $scope.$watch('form.documents', function() {
        $scope.uploadDocuments($scope.form.documents);
      });

      $scope.uploadDocuments = function(files) {
        /*jshint -W083 */
        if (files && files.length) {
          for (var i = 0; i < files.length; i++) {
            $scope.form.documentIsBeingSent = true;
            var file = files[i];
            Upload.upload({
              url: ENV.apiEndpoint + '/documents',
              file: file,
              data:{
                'user':$scope.user.ido},
              sendFieldsAs: 'form',
              skipAuthorization: true
            }).success(function() {
              $scope.form.documentIsBeingSent = false;
            }).error(function(data, status, headers, config) {
              console.log('ERROR', data, status, headers, config);
              $scope.form.documentIsBeingSent = false;
            });
          }
        }
      };

    }

  ]
);