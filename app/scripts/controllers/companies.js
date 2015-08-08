'use strict';

angular.module('cvsApp').controller('CompaniesCtrl', ['$scope', 'Restangular',

  function($scope, Restangular) {
    $scope.companiesCollection = Restangular.all('companies').getList().$object;
    $scope.companiesDisplayedCollection = [].concat($scope.companiesCollection);
  }

]);