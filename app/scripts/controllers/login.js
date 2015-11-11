'use strict';

angular.module('cvsApp').controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'AuthService', '$stateParams', 'SweetAlert', function($rootScope, $scope, $state, AuthService, $stateParams, SweetAlert) {

  $scope.credentials = {
    email: '',
    password: ''
  };
  $scope.badCredentials = false;

  $scope.passwordReset = {
    token: $stateParams.token || false,
    password: '',
    confirmation: ''
  };

  $scope.login = function() {
    AuthService.login($scope.credentials).then(
      function() {
        AuthService.getUser().then(function() {
          $state.go('account');
        }, function() {
          $state.go('logout');
        });
      }, function() {
        $scope.badCredentials = true;
      }
    );
  };

  $scope.resetPassword = function() {
    AuthService.askPasswordReset($scope.credentials.email).then(function(resp) {
      console.log('success', resp);
      SweetAlert.swal({html: true, closeOnConfirm: true, closeOnCancel: true, title: "Message envoyé", text: "Un email permettant de réinitialiser votre mot de passe<br>vient de vous être envoyé.", type: "success"});
    }, function(err) {
      SweetAlert.swal({html: true, title:"Échec", text: "Aucun compte trouvé.", type: "error"});
    });
  };

  $scope.doResetPassword = function() {
    AuthService.doPasswordReset($scope.passwordReset).then(function(resp) {
      SweetAlert.swal({html: true, closeOnConfirm: true, closeOnCancel: true, title: "Mot de passe modifié", text: "Vous pouvez désormais vous connecter.", type: "success", timer: 2000}, function() {
        swal.close();
        $state.go('login');
      });
    }, function(err) {
      SweetAlert.swal({html: true, title:"Échec", text: "Nous n'avons pas réussi à modifier votre mot de passe.<br>Merci de vérifier votre saisie.", type: "error"});
    });
  }

}]);