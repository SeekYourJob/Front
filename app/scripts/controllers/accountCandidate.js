'use strict';

angular.module('cvsApp').controller('AccountCandidateCtrl',
  ['$scope', 'Restangular', '$pusher', '$rootScope',
    function($scope, Restangular, $pusher, $rootScope) {

      var pusher = $pusher($rootScope.pusherClient);
      var pusherChannel = pusher.subscribe('presence-interviews');

      $scope.user = $scope.$parent.user;
      $scope.slots = [];
      $scope.companies = [];
      $scope.isWaiting = false;
      $scope.displayCompanies = [];
      $scope.pusherChannelMembers = pusherChannel.members;

      function getInterviews() {
        Restangular.one("interviews/candidate/" + $scope.user.ido).get().then(function(response) {
          $scope.slots = response.slots;
          $scope.companies = response.companies;
        });
      }
      getInterviews();

      $scope.actOnInterview = function(company, interview) {
        if ($scope.isWaiting) {
          return ;
        }

        if (interview.interview) {
          $scope.cancelInterview(interview);
        } else if (interview.free_slots > 0) {
          $scope.registerInterview(company, interview);
        }
      };

      $scope.registerInterview = function(company, interview) {
        $scope.isWaiting = true;
        interview.isWaiting = true;

        Restangular.one("interviews/register").customPOST({
          company_ido: company.company.ido,
          slot_id: interview.slot_id
        }).then(function() {
          $scope.isWaiting = false;
          getInterviews();
        }, function() {
          $scope.isWaiting = false;
          getInterviews();
        });
      };

      $scope.cancelInterview = function(interview) {
        console.log(interview);
        $scope.isWaiting = true;
        interview.isWaiting = true;

        Restangular.one("interviews/" + interview.interview + "/free").customPOST({})
          .then(function() {
          $scope.isWaiting = false;
          getInterviews();
        }, function() {
          $scope.isWaiting = false;
          getInterviews();
        });
      };

      pusherChannel.bind('interviews-updated',
        function() {
          getInterviews();
        }
      );

    }
  ]
);
