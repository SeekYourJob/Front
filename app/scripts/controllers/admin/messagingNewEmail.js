'use strict';

angular.module('cvsApp').controller('AdminMessagingNewEmailCtrl',
  ['$scope', 'Restangular',
    function($scope, Restangular) {
      $scope.users = [];
      $scope.groups = [];

      $scope.sendingType = 'toUsers';
      $scope.selected = {
        users: [],
        groups: []
      };
      $scope.message = {
        object: '',
        content: ''
      };

      // Fetching emails
      Restangular.one('users/emails').get().then(function(usersEmailAddresses) {
        $scope.users = usersEmailAddresses.plain();
      });

      // Fetching groups
      Restangular.one('users/groups').get().then(function(usersGroups) {
        $scope.groups = usersGroups.plain();
        console.log($scope.groups);
      });

      // Sending email
      $scope.sendEmail = function() {
        Restangular.all('messaging/send-email')
          .customPOST({
            sendingType: $scope.sendingType,
            selection: $scope.selected,
            message: $scope.message
          })
          .then(function(response) {
            console.log(response);
          });
      };


    }
  ]
);