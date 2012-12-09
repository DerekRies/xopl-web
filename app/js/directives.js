'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).directive('coolFade', function() {
    return {
      compile: function(elm) {
        console.log('compiling');
        return function(scope, elm, attrs) {
          console.log('animating');
          $(elm).css('top', 0);
        };
      }
    };
  });
