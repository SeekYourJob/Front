/**
 * Created by Nicolas on 11/11/2015.
 */
'use strict';

angular.module('cvsApp').controller('AdminCandidatesCtrl', ['$scope', 'Restangular', '$state',
    function($scope, Restangular, $state) {

        Restangular.all('candidates').getList().then(function(candidates) {
            $scope.candidatesCollection = candidates;
            $scope.candidatesDisplayedCollection = [].concat($scope.candidatesCollection);
        });

        $scope.$watch('candidatesDisplayedCollection', function(candidates) {
          if (Array.isArray(candidates) && candidates.length === 1) {
            $state.go('app.admin.candidates.details', {id: candidates[0].ido});
          }
        });

    }
]);