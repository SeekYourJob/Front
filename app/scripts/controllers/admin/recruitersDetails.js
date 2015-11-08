'use strict';

angular.module('cvsApp').controller('AdminRecruitersDetailsCtrl', ['$scope', '$state', 'Restangular', '$modal', function($scope, $state, Restangular, $modal) {

  var selectStudentForInterviewModal = false;

  $scope.recruiter = {};
  $scope.companies = [];
  $scope.recruiterInterviews = {};

  $scope.slots = [];
  $scope.selected = {};
  $scope.availableCandidates = [];

  function refreshInterviews() {
    Restangular.one('interviews/recruiter', $scope.recruiter.ido).get().then(function(recruiterInterviews) {
      $scope.recruiterInterviews = recruiterInterviews.plain();
    });
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

  // Cancel interview
  $scope.freeInterview = function(interview) {
    Restangular.one("interviews", interview.ido).customPOST(undefined, 'free')
      .then(function() {
        refreshInterviews();
      });
  };

  // Remove interview availability
  $scope.deleteInterview = function(interview) {
    Restangular.one('interviews', interview.ido).remove().then(function() {
      refreshInterviews();
    });
  };

  // Create interview availability
  $scope.createInterview = function(interview) {
    Restangular.all('interviews').customPOST({slot: interview.slot.ido, recruiter: $scope.recruiter.ido})
      .then(function() {
        refreshInterviews();
      });
  };

  // Book interview
  $scope.bookInterview = function(interview) {
    $scope.selected.slot = interview.slot;

    Restangular.one('interviews/candidates-available-for-slot', interview.slot.ido).get()
      .then(function(availableCandidates) {
        console.log(availableCandidates.plain());
        $scope.availableCandidates = availableCandidates.plain().candidates;
        $scope.slots = availableCandidates.plain().slots;

        selectStudentForInterviewModal = $modal.open({
          animation: true,
          templateUrl: 'selectStudentForInterviewModal.html',
          scope: $scope
        });
      });
  };

  $scope.doBookInterview = function() {
    Restangular.one("interviews/register").customPOST({
      slot_ido: $scope.selected.slot.ido,
      company_ido: $scope.recruiter.company.ido,
      recruiter_ido: $scope.recruiter.ido,
      candidate_ido: $scope.selected.availableCandidate.ido
    }).then(function(response) {
      refreshInterviews();
      selectStudentForInterviewModal.close();
    }, function(err) {
      alert(err); //TODO
    });
  };

}]);