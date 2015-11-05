'use strict';

angular.module('cvsApp').controller('AccountCandidateCtrl',
  ['$scope', 'Restangular',
    function($scope, Restangular) {

      $scope.user = $scope.$parent.user;
      $scope.slots = [];
      $scope.companies = [];
      $scope.isWaiting = false;

      Restangular.one("candidates/" + $scope.user.ido + "/interviews").get().then(function(response) {
        $scope.slots = response.slots;
        $scope.companies = response.companies;
      });

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
        }).then(function(response) {
          console.log(response);
          console.log(company);
          $scope.isWaiting = false;
          interview.isWaiting = false;
        });
      };

      $scope.cancelInterview = function(interview) {
        console.log(interview);
      };

      //var pusher = $pusher(client);
      //var my_channel = pusher.subscribe('test-channel');
      //my_channel.bind('updated',
      //  function(data) {
      //    console.log('updated', data);
      //  }
      //);

    }
  ]
);
