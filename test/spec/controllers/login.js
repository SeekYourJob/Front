'use strict';

describe('Controller: LoginCtrl', function() {

  beforeEach(module('cvsApp'));

  var LoginCtrl, scope;

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope
    });
  }));

  it('should contains empty email and password fields', function () {
    expect(scope.credentials.email).toBe('');
    expect(scope.credentials.password).toBe('');
  });

});