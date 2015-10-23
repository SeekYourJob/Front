'use strict';

angular.module('cvsApp').controller('AccountCandidateCtrl',
  ['$scope', '$pusher',
    function($scope, $pusher) {

      $scope.user = $scope.$parent.user;

      console.log('hello');

      var pusher = $pusher(client);
      var my_channel = pusher.subscribe('test-channel');
      my_channel.bind('updated',
        function(data) {
          console.log('updated', data);
        }
      );

    }
  ]
);