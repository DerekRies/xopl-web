'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider.when('/', {templateUrl: 'app/partials/home.html', controller: HomeCtrl});
    $routeProvider.when('/demo', {templateUrl: 'app/partials/demo.html', controller: DemoCtrl});
    $routeProvider.when('/learn', {templateUrl: 'app/partials/learn.html', controller: LearnCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
