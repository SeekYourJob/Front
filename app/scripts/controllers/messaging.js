'use strict';

angular.module('cvsApp').controller('MessagingCtrl',
  ['$scope',
    function($scope) {

      $scope.lastEmails = [];
      $scope.lastSMS = [];

    }
  ]
);