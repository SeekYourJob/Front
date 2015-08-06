'use strict';

angular.module('cvsApp').controller('AdminCtrl', ['$rootScope', '$scope', '$state', 'AuthService',
  function($rootScope, $scope, $state, AuthService) {

    //$scope.test = {};
    //
    //$scope.init = function() {
    //  AuthService.login({
    //    email: 'me@valentinpolo.fr',
    //    password: 'polopolo'
    //  }).then(function(token) {
    //    console.log('SUCCESS, GOT TOKEN', token);
    //    $scope.test.token = token;
    //    AuthService.getUser().then(function(user) {
    //      console.log('SUCCESS, GOT USER', user);
    //      $scope.test.user = user;
    //    }, function() {
    //      console.log('ERROR WHILE GETTING USER');
    //    });
    //  }, function() {
    //    console.log('GOT ERROR WHILE LOGIN!');
    //  });
    //};
    //
    //$scope.init();

    $scope.credentials = {
      email: '',
      password: ''
    };

    $scope.login = function() {
      AuthService.login($scope.credentials).then(
        function(success) {
          console.log('SUCCESS !!!', success);
          $state.go('account');
        },
        function(error) {
          console.log('ERROR !!!', error);
        }
      );
    };

}]);