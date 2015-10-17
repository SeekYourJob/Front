'use strict';

angular.module('cvsApp').controller('AdminCompaniesCtrl', ['$scope', 'Restangular',

  function($scope, Restangular) {
    $scope.companiesCollection = Restangular.all('companies').getList().$object;
    $scope.companiesDisplayedCollection = [].concat($scope.companiesCollection);
  }

]);