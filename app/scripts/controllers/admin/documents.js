/**
 * Created by Nicolas on 11/13/2015.
 */
'use strict';

angular.module('cvsApp').controller('AdminDocumentsCtrl', ['$scope', 'Restangular', 'ENV',
    function($scope, Restangular, ENV) {

        $scope.documentsCollection = [];

        Restangular.one('documents/candidates').get().then(function(documents) {
            $scope.documentsCollection = documents.plain();
        });

        $scope.refuseDocument = function(document) {
            Restangular.one('documents/'+document.ido+'/refuse').post().then(function() {
                $scope.documentsCollection.splice($scope.documentsCollection.indexOf(document), 1);
            });
        };

        $scope.acceptDocument = function(document) {
            Restangular.one('documents/'+document.ido+'/accept').post().then(function() {
                $scope.documentsCollection.splice($scope.documentsCollection.indexOf(document), 1);
            });
        };

        $scope.downloadDocument = function(document) {
            Restangular.one("documents/request-token", document.ido).get().then(function(download) {
              window.location.assign(ENV.apiEndpoint + '/documents/' + download.plain().token);
            });
        };
    }
]);