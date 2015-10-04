'use strict';

angular.module('cvsApp').controller('RecruitersDetailsCtrl', ['$scope', '$state', 'Restangular',
  function($scope, $state, Restangular) {

    $scope.recruiter = {};
    $scope.companies = [];
    $scope.recruiterInterviews = {};

    function refreshInterviews() {
      Restangular.one('interviews/recruiter', $scope.recruiter.ido).get().then(function(recruiterInterviews) {
        $scope.recruiterInterviews = recruiterInterviews.plain();
      });
      console.log('Interviews refreshed');
    }

    // Recruiter details
    Restangular.one("recruiters", $state.params.id).get().then(function(recruiter) {
      $scope.recruiter = recruiter;

      // Interviews
      refreshInterviews();
    });

    // Companies
    Restangular.all('companies').getList().then(function(companies) {
      $scope.companies = companies;
    });

    // Saving updated recruiter
    $scope.updateRecruiter = function() {
      $scope.recruiter.put();
    };

    $scope.freeInterview = function(interview) {
      console.log('FREE interview', interview);

      // GET /accounts/123/messages
      Restangular.one("interviews", interview.ido).customPOST(undefined, 'free');

      refreshInterviews();
    };

    $scope.deleteInterview = function(interview) {
      Restangular.one('interviews', interview.ido).remove();
      refreshInterviews();
    };

    $scope.createInterview = function(interview) {
      Restangular.all('interviews').customPOST({slot: interview.slot.ido, recruiter: $scope.recruiter.ido});
      refreshInterviews();
    };

    $scope.bookInterview = function(interview) {
      //TODO
    };

  }
]);