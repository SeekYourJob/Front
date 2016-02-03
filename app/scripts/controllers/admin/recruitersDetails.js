'use strict';

angular.module('cvsApp').controller('AdminRecruitersDetailsCtrl', ['$scope', '$state', 'Restangular','Upload','ENV', '$modal', 'UploadService',
  function($scope, $state, Restangular, Upload, ENV, $modal, UploadService) {

    var selectStudentForInterviewModal = false;

    $scope.recruiter = {};
    $scope.user = {};
    $scope.companies = [];
    $scope.recruiterInterviews = {};
    $scope.documents = [];

    $scope.locations = [];
    $scope.newLocationForAllInterviews = {};

    $scope.slots = [];
    $scope.selected = {};
    $scope.availableCandidates = [];

    $scope.form = {
      documents: false,
      documentIsBeingSent: false
    };

    function refreshInterviews() {
      Restangular.one('interviews/recruiter', $scope.recruiter.ido).get().then(function(recruiterInterviews) {
        $scope.recruiterInterviews = recruiterInterviews.plain();
      });
    }

    // Documents
    function getDocuments() {
      Restangular.one('documents/user',$scope.user.ido).get().then(function(documents) {
        $scope.documents = documents.plain();
      });
    }

    // Locations
    function getLocations() {
      Restangular.one('locations').get().then(function(locations) {
        $scope.locations = locations.plain();
      });
    }
    getLocations();

    // Recruiter details
    Restangular.one("recruiters", $state.params.id).get().then(function(recruiter) {
      $scope.recruiter = recruiter;
      $scope.user = recruiter.user;
      getDocuments();
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

    Restangular.one('interviews/candidates-available-for-slot-and-company')
      .get({idoSlot: interview.slot.ido, idoCompany: $scope.recruiter.company.ido})
      .then(function(availableCandidates) {
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

  $scope.updateLocationForInterview = function(interview, previousInterview) {
    previousInterview = JSON.parse(previousInterview);
    Restangular.one("locations/update-interview/" + interview.ido).customPUT({
      idoLocation: (interview.location) ? interview.location.ido : 'NONE'
    }).then(function(response) {
      refreshInterviews();
    }, function(err) {
      alert('Cet emplacement est déjà occupé !');
      interview.location = previousInterview.location;
      refreshInterviews();
    });
  };

  $scope.updateLocationForAllInterviews = function() {
    Restangular.one("locations/update-recruiter/" + $scope.recruiter.ido).customPUT({
      idoLocation: ($scope.newLocationForAllInterviews) ? $scope.newLocationForAllInterviews.ido : 'NONE'
    }).then(function(response) {
      refreshInterviews();
    }, function(err) {
      alert('Certains emplacements sont déjà attribués !');
      refreshInterviews();
    });
  };

  $scope.$watch('form.documents', function() {
    $scope.uploadDocuments($scope.form.documents);
  });

  $scope.uploadDocuments = function(files) {
    $scope.form.documentIsBeingSent = true;
    UploadService.upload($scope.user,files,$scope.documents);
    $scope.form.documentIsBeingSent = false;
  };

  $scope.deleteDocument = function(document) {
    Restangular.one("documents", document.ido).remove().then(function() {
      $scope.documents.splice($scope.documents.indexOf(document), 1);
    });
  };

  $scope.downloadDocument = function(document) {
    Restangular.one("documents/request-token", document.ido).get().then(function(download) {
      window.location.assign(ENV.apiEndpoint + '/documents/' + download.plain().token);
    });
  };

}]);