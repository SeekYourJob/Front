'use strict';

angular.module('cvsApp').controller('AdminMessagingNewEmailCtrl',
  ['$scope', 'Restangular', 'SweetAlert',
    function($scope, Restangular, SweetAlert) {

      $scope.users = [];
      $scope.groups = [];

      function initForm() {
        $scope.sendingType = 'toUsers';
        $scope.selected = {
          users: [],
          groups: []
        };
        $scope.message = {
          object: '',
          content: ''
        };
      }
      initForm();


      // Fetching emails
      Restangular.one('users/emails').get().then(function(usersEmailAddresses) {
        $scope.users = usersEmailAddresses.plain();
      });

      // Fetching groups
      Restangular.one('users/groups').get().then(function(usersGroups) {
        $scope.groups = usersGroups.plain();
      });

      $scope.canBeSent = function() {
        return $scope.message.object !== '' &&
            $scope.message.content !== '' &&
            ( $scope.selected.users.length || $scope.selected.groups.length );
      };

      // Sending email
      $scope.sendEmail = function() {
        SweetAlert.swal({
            html: true,
            title: "Êtes-vous certain ?",
            text: "Votre message est sur le point d'être envoyé.<br>Souhaitez-vous poursuivre ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#00C853", confirmButtonText: "Oui, envoyer !",
            cancelButtonText: "Non, annuler",
            closeOnConfirm: false,
            closeOnCancel: false },
          function(isConfirm){
            if (isConfirm) {
              Restangular.all('messaging/send-email')
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