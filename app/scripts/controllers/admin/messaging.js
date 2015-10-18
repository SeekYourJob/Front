'use strict';

angular.module('cvsApp').controller('AdminMessagingCtrl',
  ['$scope',
    function($scope) {

      $scope.lastEmails = [];
      $scope.lastSMS = [];

    }
  ]
);