'use strict';

angular.module('cvsApp').controller('AccountCandidateCtrl',
  ['$scope', 'Restangular', '$rootScope','UploadService','ENV', '$modal',
    function($scope, Restangular, $rootScope, UploadService, ENV, $modal) {

      var pusherChannel = $rootScope.pusherClient.subscribe('presence-interviews');
      var showOffersModal = false;


      $scope.user = $scope.$parent.user;
      $scope.slots = [];
      $scope.companies = [];
      $scope.isWaiting = false;
      $scope.displayCompanies = [];
      $scope.pusherChannelMembers = pusherChannel.members;
      $scope.summary = {};
      $scope.offersModalComponents = {};

      $scope.documents = [];

      $scope.form = {
        documents: false,
        documentIsBeingSent: false
      };

      function getCandidateSummary() {
        Restangular.one("candidates/" + $scope.user.profile_ido + "/summary").get().then(function(response) {
          $scope.summary = response.plain();
        });
      }

      function getInterviews() {
        Restangular.one("interviews/candidate-by-company/" + $scope.user.profile_ido).get().then(function(response) {
          $scope.slots = response.slots;
          $scope.companies = response.companies;
        });

        getCandidateSummary();
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
          slot_ido: interview.slot_ido
        }).then(function() {
          $scope.isWaiting = false;
          getInterviews();
        }, function() {
          $scope.isWaiting = false;
          getInterviews();
        });
      };

      $scope.cancelInterview = function(interview) {
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

      // Documents
      $scope.$watch('form.documents', function() {
        $scope.uploadDocuments($scope.form.documents);
      });

      $scope.uploadDocuments = function(files) {
        $scope.form.documentIsBeingSent = true;
        UploadService.upload($scope.user,files,$scope.documents);
        $scope.form.documentIsBeingSent = false;
      };

      Restangular.one('documents/user',$scope.user.ido).get().then(function(documents) {
        $scope.documents = documents.plain();
      });

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

      $scope.showCompany = function(company) {
        Restangular.one("companies/" + company.ido + "/offers").get().then(function(response) {

          $scope.offersModalComponents.company = company;
          $scope.offersModalComponents.offers = response.plain();

          console.log($scope.offersModalComponents);

          showOffersModal = $modal.open({
            animation: true,
            templateUrl: 'showCompanysOffers.html',
            scope: $scope
          });
        });
      };

    }
  ]
);
