'use strict';

angular.module('cvsApp').controller('AdminMessagingPredefinedEmailCtrl',
  ['$scope', 'Restangular', 'SweetAlert',
    function($scope, Restangular, SweetAlert) {

      $scope.predefinedEmails = [];

      // Fetching predefined emails
      Restangular.one('messaging/predefined-emails').get().then(function(predefinedEmails) {
        $scope.predefinedEmails = predefinedEmails.plain();
      });

      // Sending email
      $scope.sendPredefinedEmail = function(key) {
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
              Restangular.all('messaging/send-predefined-email')
                .customPOST({
                  predefinedEmailKey: key
                })
                .then(function(success) {
                  SweetAlert.swal("Message envoyé !", "Votre message a bien été envoyé.", "success");
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