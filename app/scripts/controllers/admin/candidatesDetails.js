/**
 * Created by Nicolas on 12/26/2015.
 */
'use strict';

angular.module('cvsApp').controller('AdminCandidatesDetailsCtrl', ['$scope', '$state', 'Restangular','Upload','ENV', 'UploadService',
    function($scope, $state, Restangular, Upload, ENV, UploadService) {

        $scope.candidate = {};
        $scope.user = {};
        $scope.documents = [];

        $scope.form = {
            documents: false,
            documentIsBeingSent: false
        };

        // Documents
        function getDocuments() {
            Restangular.one('documents/user',$scope.user.ido).get().then(function(documents) {
                $scope.documents = documents.plain();
            });
        }

        // Candidate details
        Restangular.one("candidates", $state.params.id).get().then(function(candidate) {
            $scope.candidate = candidate;
            $scope.user = candidate.user;
            // Documents
            getDocuments();
        });


        $scope.$watch('form.documents', function() {
            $scope.uploadDocuments($scope.form.documents);
        });

        $scope.uploadDocuments = function(files) {
            $scope.form.documentIsBeingSent = true;
            UploadService.upload($scope.user,files,$scope.documents);
            $scope.form.documentIsBeingSent = false;
        };

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

    }]);
