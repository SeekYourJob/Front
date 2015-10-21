'use strict';

angular.module('cvsApp').controller('AdminMessagingNewSMSCtrl',
  ['$scope', 'Restangular', 'SweetAlert', '$filter',
    function($scope, Restangular, SweetAlert, $filter) {

      $scope.users = [];
      $scope.groups = [];
      $scope.remainingSMSCredits = {};

      function initForm() {
        $scope.sendingType = 'toUsers';
        $scope.selected = {
          users: [],
          groups: []
        };
        $scope.message = '';
      }
      initForm();

      function estimateNumberSent() {
        if ($scope.sendingType === 'toUsers') {
          return $scope.selected.users.length.toFixed(4);
        } else if ($scope.sendingType === 'toGroups') {
          var totalUsers = 0;
          for (var i = 0; i < $scope.selected.groups.length; i++) {
            totalUsers += $scope.selected.groups[i].length;
          }
          return totalUsers.toFixed(4);
        }
      }

      function estimateSendingCost() {
        return estimateNumberSent() * 0.0528;
      }

      // Fetching phone numbers
      Restangular.one('users/phone-numbers').get().then(function(usersPhones) {
        $scope.users = usersPhones.plain();
      });

      // Fetching groups
      Restangular.one('users/groups').get().then(function(usersGroups) {
        $scope.groups = usersGroups.plain();
      });

      // Getting remaining SMS credits
      Restangular.one('messaging/remaining-sms-credits').get().then(function(remainingSMSCredits) {
        $scope.remainingSMSCredits = remainingSMSCredits.plain();
      });

      // Determines if Text Message can be sent
      $scope.canBeSent = function() {
        return $scope.message !== '' &&
          ( $scope.selected.users.length || $scope.selected.groups.length );
      };

      // Sending SMS
      $scope.sendSMS = function() {
        if ($scope.remainingSMSCredits.remaining_sms > estimateNumberSent()) {
          SweetAlert.swal({
              html: true,
              title: "Êtes-vous certain ?",
              text: "Votre message est sur le point d'être envoyé.<br>" +
              "Souhaitez-vous poursuivre ?<br><br>" +
              "<strong>Cet envoi consommera " + $filter('number')(estimateNumberSent(), 0) + " crédits sur vos " + $scope.remainingSMSCredits.remaining_sms + " restants.</strong><br>" +
              "Le coût estimé de cet envoi est de " + $filter('number')(estimateSendingCost(), 3).toLocaleString() + " &euro;",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#00C853", confirmButtonText: "Oui, envoyer !",
              cancelButtonText: "Non, annuler",
              closeOnConfirm: false,
              closeOnCancel: false },
            function (isConfirm){
              if (isConfirm) {
                Restangular.all('messaging/send-sms')
                  .customPOST({
                    sendingType: $scope.sendingType,
                    selection: $scope.selected,
                    message: $scope.message
                  })
                  .then(function(success) {
                    SweetAlert.swal("Message envoyé !", "Votre message a bien été envoyé.", "success");
                    initForm();
                  }, function(error) {
                    SweetAlert.swal({html: true, title:"Échec de l'envoi", text: "Une erreur est survenue pendant l'envoi du message.<br>Merci de réessayer dans quelques instants...", type: "error"});
                  });
              } else {
                SweetAlert.swal("Envoi annulé", "Soyez sans crainte, l'envoi a bien été annulé.", "error");
              }
            }
          );
        } else {
          SweetAlert.swal({
            html: true,
            title:"Envoi impossible !",
            text: "Cet envoi requiert " + $filter('number')(estimateNumberSent(), 0) + " crédit(s)<br>" +
            "et votre compte n'en dispose que de " + $scope.remainingSMSCredits.remaining_sms + ".", type: "error"});
        }
      };

    }
  ]
);