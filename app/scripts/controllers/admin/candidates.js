/**
 * Created by Nicolas on 11/11/2015.
 */
'use strict';

angular.module('cvsApp').controller('AdminCandidatesCtrl', ['$scope', 'Restangular',

    function($scope, Restangular) {
        Restangular.all('candidates').getList().then(function(candidates) {
            $scope.candidatesCollection = candidates;
            $scope.candidatesDisplayedCollection = [].concat($scope.candidatesCollection);
        });
    }
]);