'use strict';

angular.module('cvsApp').controller('AdminMessagingNewSMSCtrl',
  ['$scope', 'Restangular', 'SweetAlert', '$filter',
    function($scope, Restangular, SweetAlert, $filter) {

      $scope.users = [];
      $scope.groups = [];

      function initForm() {
        $scope.sendingType = 'toUsers';
        $scope.selected = {
          users: [],
          groups: []
        };
        $scope.message = '';
      }
      initForm();

      function estimateSendingCost() {
        var pricePerSMS = 0.024;
        if ($scope.sendingType === 'toUsers') {
          return $scope.selected.users.length.toFixed(3) * pricePerSMS;
        } else if ($scope.sendingType === 'toGroups') {
          var totalUsers = 0;
          for (var i = 0; i < $scope.selected.groups.length; i++) {
            totalUsers += $scope.selected.groups[i].length;
          }
          return totalUsers.toFixed(3) * pricePerSMS;
        }
      }

      // Fetching phone numbers
      Restangular.one('users/phone-numbers').get().then(function(usersPhones) {
        $scope.users = usersPhones.plain();
      });

      // Fetching groups
      Restangular.one('users/groups').get().then(function(usersGroups) {
        $scope.groups = usersGroups.plain();
      });

      $scope.canBeSent = function() {
        return $scope.message !== '' &&
            ( $scope.selected.users.length || $scope.selected.groups.length );
      };

      // Sending SMS
      $scope.sendSMS = function() {
        SweetAlert.swal({
            html: true,
            title: "Êtes-vous certain ?",
            text: "Votre message est sur le point d'être envoyé.<br>" +
            "Souhaitez-vous poursuivre ?<br><br>" +
            "<strong>Le coût estimé de cet envoi est de " + $filter('number')(estimateSendingCost(), 2).toLocaleString() + " &euro;</strong>",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00C853", confirmButtonText: "Oui, envoyer !",
            cancelButtonText: "Non, annuler",
            closeOnConfirm: false,
            closeOnCancel: false },
          function(isConfirm){
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
          });
      };

    }
  ]
);