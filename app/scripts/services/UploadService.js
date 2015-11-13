/**
 * Created by Nicolas on 11/12/2015.
 */
'use strict';

angular.module('cvsApp').service('UploadService', ['$http', '$q', 'ENV', 'Upload',
    function($http, $q, ENV, Upload) {

    var self = this;

    self.upload = function(user, files, userDocuments) {
        var deferred = $q.defer();
        var data =  {};

        if (user !== null) {
            data.user = user.ido;
        }
        if( files && files.constructor !== Array ) {
            files = [files];
        }
        /*jshint -W083 */
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: ENV.apiEndpoint + '/documents',
                    file: file,
                    data: data,
                    sendFieldsAs: 'form',
                    skipAuthorization: true
                }).success(function(document) {
                    if(user !== null && user.profile ===  'CVS\\\\Candidate' ) {
                        userDocuments = [];
                    }
                    userDocuments.push(document);
                    deferred.resolve();
                }).error(function(data, status, headers, config) {
                    deferred.reject('Error while uploading documents');
                    console.log('ERROR', data, status, headers, config);
                });
            }
        }
        return deferred.promise;
    };
}]);