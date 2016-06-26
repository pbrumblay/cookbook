'use strict';

var app = angular.module('app', ['app.services', 'app.controllers', 'xeditable']);

//lifted: https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
app.factory('authInterceptor', function ($rootScope, $q, $window) {
   return {
      request: function (config) {
         config.headers = config.headers || {};
         if ($window.sessionStorage.token) {
            config.headers.Authorization = $window.sessionStorage.token;
         }
         return config;
      }
   };
});

app.config(function ($httpProvider) {
   $httpProvider.interceptors.push('authInterceptor');
});


app.run(function(editableOptions) {
   editableOptions.theme='bs3';
});